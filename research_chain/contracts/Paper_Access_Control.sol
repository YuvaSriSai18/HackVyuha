// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPaperPublishing {
    enum AccessType { OPEN, PAID }

    struct Paper {
        uint256 id;
        string title;
        string ipfsHash;
        address[] authors;
        address publisher;
        uint256 timestamp;
        AccessType access;
    }

    function getPaper(uint256 _paperId) external view returns (Paper memory);
}

interface IReChainToken {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract AccessControl {
    address public paperPublishingAddress;
    address public rchnTokenAddress;

    mapping(uint256 => mapping(address => bool)) public hasAccess;
    mapping(uint256 => uint256) public paperAccessCosts;

    event AccessGranted(uint256 paperId, address user);
    event AccessPaid(uint256 paperId, address user, uint256 amount);
    event AccessCostSet(uint256 paperId, uint256 cost);

    constructor(address _paperPublishingAddress, address _rchnTokenAddress) {
        paperPublishingAddress = _paperPublishingAddress;
        rchnTokenAddress = _rchnTokenAddress;
    }

    function getAccess(uint256 paperId) public view returns (bool) {
        IPaperPublishing.Paper memory paper = IPaperPublishing(paperPublishingAddress).getPaper(paperId);

        if (hasAccess[paperId][msg.sender]) return true;
        if (paper.access == IPaperPublishing.AccessType.OPEN) return true;

        for (uint i = 0; i < paper.authors.length; i++) {
            if (paper.authors[i] == msg.sender) return true;
        }

        return false;
    }

    function payForAccess(uint256 paperId) external {
        IPaperPublishing paperContract = IPaperPublishing(paperPublishingAddress);
        IPaperPublishing.Paper memory paper = paperContract.getPaper(paperId);

        // Check if the paper is paid
        require(paper.access == IPaperPublishing.AccessType.PAID, "Access denied: Not a paid paper");

        // Check if user already has access
        require(!hasAccess[paperId][msg.sender], "Access already granted");

        // Get the cost
        uint256 cost = paperAccessCosts[paperId];
        require(cost > 0, "Access cost is not set for this paper");

        // Perform token transfer
        IReChainToken rchn = IReChainToken(rchnTokenAddress);
        bool success = rchn.transferFrom(msg.sender, paper.publisher, cost);
        require(success, "Token transfer failed: Check approval and balance");

        // Grant access
        hasAccess[paperId][msg.sender] = true;

        emit AccessPaid(paperId, msg.sender, cost);
        emit AccessGranted(paperId, msg.sender);
    }


    function setPaperAccessCost(uint256 paperId, uint256 _newCost) external {
        IPaperPublishing.Paper memory paper = IPaperPublishing(paperPublishingAddress).getPaper(paperId);

        require(paper.access == IPaperPublishing.AccessType.PAID, "Paper must be PAID to set cost");
        require(isOwnerOrAuthor(paper, msg.sender), "Only publisher or authors can set cost");

        paperAccessCosts[paperId] = _newCost;

        emit AccessCostSet(paperId, _newCost);
    }

    // Internal utility function to check permission
    function isOwnerOrAuthor(IPaperPublishing.Paper memory paper, address user) internal pure returns (bool) {
        if (user == paper.publisher) return true;
        for (uint256 i = 0; i < paper.authors.length; i++) {
            if (paper.authors[i] == user) return true;
        }
        return false;
    }
}
