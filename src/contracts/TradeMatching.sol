// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./OrderBook.sol";

contract TradeMatching is VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
    OrderBook public orderBook;
    
    struct MatchRequest {
        uint256 buyOrderId;
        uint256[] eligibleSellOrders;
        bool fulfilled;
    }
    
    mapping(bytes32 => MatchRequest) public matchRequests;
    
    event MatchRequested(bytes32 requestId, uint256 buyOrderId);
    event MatchCompleted(uint256 buyOrderId, uint256 selectedSellOrderId, uint256 executionPrice);

    constructor(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        address _orderBook
    ) 
        VRFConsumerBase(_vrfCoordinator, _linkToken) 
    {
        keyHash = _keyHash;
        fee = _fee;
        orderBook = OrderBook(_orderBook);
    }

    function requestMatch(uint256 buyOrderId, uint256[] memory eligibleSellOrders) external {
        require(eligibleSellOrders.length > 0, "No eligible sellers");
        require(LINK.balanceOf(address(this)) >= fee, "Insufficient LINK");
        
        bytes32 requestId = requestRandomness(keyHash, fee);
        matchRequests[requestId] = MatchRequest({
            buyOrderId: buyOrderId,
            eligibleSellOrders: eligibleSellOrders,
            fulfilled: false
        });
        
        emit MatchRequested(requestId, buyOrderId);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        MatchRequest storage request = matchRequests[requestId];
        require(!request.fulfilled, "Match already fulfilled");
        
        uint256 selectedIndex = randomness % request.eligibleSellOrders.length;
        uint256 selectedSellOrderId = request.eligibleSellOrders[selectedIndex];
        
        orderBook.matchOrders(request.buyOrderId, selectedSellOrderId);
        
        request.fulfilled = true;
        emit MatchCompleted(request.buyOrderId, selectedSellOrderId, 0); // Execution price not available here
    }
}