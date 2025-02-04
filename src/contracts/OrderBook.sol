// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CarbonCredit.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract OrderBook is ReentrancyGuard, Pausable {
    struct Order {
        address trader;
        uint256 amount;
        uint256 minPrice;
        uint256 maxPrice;
        bytes32 commitment;
        bytes32 nullifier;
        bool isBuyOrder;
        bool isActive;
        OrderType orderType;
        uint256 timestamp;
        uint256 gasPrice;
    }

    enum OrderType { ENERGY, CARBON }

    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    mapping(bytes32 => bool) public usedNullifiers;
    uint256 public nextOrderId = 1;

    CarbonCredit public immutable carbonToken;

    event OrderCreated(
        uint256 indexed orderId,
        address indexed trader,
        uint256 amount,
        uint256 minPrice,
        uint256 maxPrice,
        bytes32 commitment,
        bool isBuyOrder,
        OrderType orderType,
        uint256 gasPrice
    );
    event OrderCancelled(uint256 indexed orderId);
    event OrderMatched(uint256 indexed buyOrderId, uint256 indexed sellOrderId, uint256 price);

    constructor(address _carbonToken) {
        require(_carbonToken != address(0), "Invalid token address");
        carbonToken = CarbonCredit(_carbonToken);
        _unpause(); // Initialize Pausable state
    }

    function createOrder(
        uint256 amount,
        uint256 minPrice,
        uint256 maxPrice,
        bytes32 commitment,
        bytes32 nullifier,
        bool isBuyOrder,
        OrderType orderType
    ) external payable whenNotPaused nonReentrant {
        require(amount > 0, "Invalid amount");
        require(minPrice <= maxPrice, "Invalid price range");
        require(!usedNullifiers[nullifier], "Nullifier already used");

        uint256 gasPrice = tx.gasprice;

        if (isBuyOrder && orderType == OrderType.ENERGY) {
            require(msg.value >= amount * maxPrice, "Insufficient ETH");
        } else if (!isBuyOrder && orderType == OrderType.CARBON) {
            require(carbonToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        }

        uint256 orderId = nextOrderId++;
        orders[orderId] = Order({
            trader: msg.sender,
            amount: amount,
            minPrice: minPrice,
            maxPrice: maxPrice,
            commitment: commitment,
            nullifier: nullifier,
            isBuyOrder: isBuyOrder,
            isActive: true,
            orderType: orderType,
            timestamp: block.timestamp,
            gasPrice: gasPrice
        });
        userOrders[msg.sender].push(orderId);
        usedNullifiers[nullifier] = true;

        emit OrderCreated(
            orderId,
            msg.sender,
            amount,
            minPrice,
            maxPrice,
            commitment,
            isBuyOrder,
            orderType,
            gasPrice
        );
    }

    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(order.trader == msg.sender, "Not order owner");
        require(order.isActive, "Order not active");

        order.isActive = false;

        if (order.isBuyOrder && order.orderType == OrderType.ENERGY) {
            payable(msg.sender).transfer(order.amount * order.maxPrice);
        } else if (!order.isBuyOrder && order.orderType == OrderType.CARBON) {
            require(carbonToken.transfer(msg.sender, order.amount), "Transfer failed");
        }

        emit OrderCancelled(orderId);
    }

    function matchOrders(uint256 buyOrderId, uint256 sellOrderId) external nonReentrant whenNotPaused {
        Order storage buyOrder = orders[buyOrderId];
        Order storage sellOrder = orders[sellOrderId];

        require(buyOrder.isActive && sellOrder.isActive, "Orders not active");
        require(buyOrder.isBuyOrder && !sellOrder.isBuyOrder, "Invalid order types");
        require(buyOrder.orderType == sellOrder.orderType, "Order types mismatch");
        require(buyOrder.amount == sellOrder.amount, "Amount mismatch");
        require(
            buyOrder.maxPrice >= sellOrder.minPrice && 
            buyOrder.minPrice <= sellOrder.maxPrice,
            "Price mismatch"
        );

        uint256 executionPrice = (buyOrder.maxPrice + sellOrder.minPrice) / 2;
        buyOrder.isActive = false;
        sellOrder.isActive = false;

        if (buyOrder.orderType == OrderType.ENERGY) {
            payable(sellOrder.trader).transfer(executionPrice * buyOrder.amount);
        } else {
            require(carbonToken.transfer(buyOrder.trader, sellOrder.amount), "Transfer failed");
            payable(sellOrder.trader).transfer(executionPrice * buyOrder.amount);
        }

        emit OrderMatched(buyOrderId, sellOrderId, executionPrice);
    }

    receive() external payable {}
}