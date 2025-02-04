// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCredit is ERC20, Ownable {
    mapping(bytes32 => bool) public usedNullifiers;
    mapping(bytes32 => bool) public verifiedProofs;

    event CreditMinted(address indexed to, uint256 amount, bytes32 commitment);
    event ProofVerified(bytes32 commitment, bytes32 nullifier);

    constructor() ERC20("Carbon Credit", "CCRX") Ownable(msg.sender) {}


    function mint(
        address to, 
        uint256 amount,
        bytes32 commitment,
        bytes32 nullifier
    ) external onlyOwner {
        require(usedNullifiers[nullifier], "Nullifier already used");
        require(verifiedProofs[commitment], "Proof already verified");

        usedNullifiers[nullifier] = true;
        verifiedProofs[commitment] = true;

        _mint(to, amount);
        
        emit CreditMinted(to, amount, commitment);
        emit ProofVerified(commitment, nullifier);
    }

    function verifyAndTransfer(
        address from,
        address to,
        uint256 amount,
        bytes32 commitment,
        bytes32 nullifier
    ) external returns (bool) {
        require(!usedNullifiers[nullifier], "Nullifier already used");
        require(!verifiedProofs[commitment], "Proof already verified");
        require(balanceOf(from) >= amount, "Insufficient balance");

        usedNullifiers[nullifier] = true;
        verifiedProofs[commitment] = true;

        _transfer(from, to, amount);

        emit ProofVerified(commitment, nullifier);
        return true;
    }

    function checkNullifier(bytes32 nullifier) external view returns (bool) {
        return usedNullifiers[nullifier];
    }

    function checkProof(bytes32 commitment) external view returns (bool) {
        return verifiedProofs[commitment];
    }
}