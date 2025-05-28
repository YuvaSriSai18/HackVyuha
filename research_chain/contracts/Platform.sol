// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Contract.sol";

contract Platform {
    ReChain_Token public token;
    uint256 public constant REGISTRATION_REWARD = 100 * 10**18;

    mapping(address => bool) public isRegistered;

    event UserRegistered(address indexed user);

    constructor(address tokenAddress) {
        token = ReChain_Token(tokenAddress);
    }

    function registerUser() external {
        require(!isRegistered[msg.sender], "Already registered");

        isRegistered[msg.sender] = true;

        // Mint registration reward to the new user
        token.mint(msg.sender, REGISTRATION_REWARD);

        emit UserRegistered(msg.sender);
    }
}
