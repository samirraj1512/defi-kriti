// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./CarbonCredit.sol";

contract CarbonMarketplace is ReentrancyGuard, Ownable, Pausable {
    // Listing structure for carbon credit sales
    struct Listing {
        address seller;
        uint256 amount;
        uint256 pricePerCredit;
        bytes32 commitment;
        bool isActive;
        uint256 timestamp;
    }

    // State variables
    CarbonCredit public carbonToken;
    uint256 public listingCount;
    uint256 public platformFee; // In basis points (1/100 of a percent)
    uint256 public constant MAX_FEE = 500; // Maximum 5% fee
    uint256 public constant LISTING_EXPIRY = 7 days;

    // Mappings
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public userListings;
    mapping(bytes32 => bool) public usedCommitments;

    // Events
    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        uint256 amount,
        uint256 pricePerCredit,
        bytes32 commitment
    );
    event Purchased(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 totalPrice
    );
    event ListingCancelled(uint256 indexed listingId);
    event PlatformFeeUpdated(uint256 newFee);

    constructor(address _carbonToken, uint256 _platformFee) {
        require(_platformFee <= MAX_FEE, "Fee too high");
        carbonToken = CarbonCredit(_carbonToken);
        platformFee = _platformFee;
    }

    function createListing(
        uint256 amount,
        uint256 pricePerCredit,
        bytes32 commitment
    ) external whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(pricePerCredit > 0, "Price must be positive");
        require(!usedCommitments[commitment], "Commitment already used");

        // Transfer tokens to marketplace
        require(
            carbonToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        // Create listing
        listingCount++;
        listings[listingCount] = Listing({
            seller: msg.sender,
            amount: amount,
            pricePerCredit: pricePerCredit,
            commitment: commitment,
            isActive: true,
            timestamp: block.timestamp
        });

        userListings[msg.sender].push(listingCount);
        usedCommitments[commitment] = true;

        emit Listed(listingCount, msg.sender, amount, pricePerCredit, commitment);
    }

    function purchaseCredits(uint256 listingId, uint256 amount) 
        external 
        payable
        whenNotPaused 
        nonReentrant 
    {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(block.timestamp - listing.timestamp <= LISTING_EXPIRY, "Listing expired");
        require(amount <= listing.amount, "Insufficient credits available");

        uint256 totalPrice = amount * listing.pricePerCredit;
        uint256 feeAmount = (totalPrice * platformFee) / 10000;
        require(msg.value >= totalPrice, "Insufficient payment");

        // Transfer credits to buyer
        require(
            carbonToken.transfer(msg.sender, amount),
            "Credit transfer failed"
        );

        // Update listing
        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.isActive = false;
        }

        // Transfer payment to seller
        payable(listing.seller).transfer(totalPrice - feeAmount);

        emit Purchased(listingId, msg.sender, listing.seller, amount, totalPrice);
    }

    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing not active");

        listing.isActive = false;
        require(
            carbonToken.transfer(msg.sender, listing.amount),
            "Transfer failed"
        );

        emit ListingCancelled(listingId);
    }

    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_FEE, "Fee too high");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    function getUserListings(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userListings[user];
    }

    function getActiveListing(uint256 listingId)
        external
        view
        returns (
            address seller,
            uint256 amount,
            uint256 pricePerCredit,
            bool isActive,
            uint256 timestamp
        )
    {
        Listing storage listing = listings[listingId];
        return (
            listing.seller,
            listing.amount,
            listing.pricePerCredit,
            listing.isActive,
            listing.timestamp
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Emergency function
    function emergencyWithdraw(address token) external onlyOwner {
        if (token == address(carbonToken)) {
            uint256 balance = carbonToken.balanceOf(address(this));
            require(balance > 0, "No tokens to withdraw");
            require(carbonToken.transfer(owner(), balance), "Transfer failed");
        } else {
            payable(owner()).transfer(address(this).balance);
        }
    }
}