// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CarbonMarketplace.sol";

contract CarbonStaking {
    CarbonMarketplace public carbonMarketplace;
    mapping(address => uint256) public stakedAmounts;
    
    constructor(address _carbonMarketplace) {
        carbonMarketplace = CarbonMarketplace(_carbonMarketplace);
    }
    
    function stake(uint256 amount) external {
        require(carbonMarketplace.balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        carbonMarketplace.transferFrom(msg.sender, address(this), amount);
        stakedAmounts[msg.sender] += amount;
    }
    
    function unstake(uint256 amount) external {
        require(stakedAmounts[msg.sender] >= amount, "Insufficient staked amount");
        
        stakedAmounts[msg.sender] -= amount;
        carbonMarketplace.transfer(msg.sender, amount);
    }
    
    function isStaked(address user) public view returns (bool) {
        return stakedAmounts[user] > 0;
    }
}