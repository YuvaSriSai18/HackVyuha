// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReChain_Token {
    string public name = "ResearchChain";
    string public symbol = "RCHN";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    address public platformContract;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyPlatform() {
        require(msg.sender == platformContract, "Only platform can call");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setPlatformContract(address _platform) external onlyOwner {
        platformContract = _platform;
    }

    function mint(address to, uint256 amount) external onlyPlatform {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(balanceOf[msg.sender] >= value, "Not enough balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(balanceOf[from] >= value, "Not enough balance");
        require(allowance[from][msg.sender] >= value, "Not approved");
        balanceOf[from] -= value;
        allowance[from][msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
}
