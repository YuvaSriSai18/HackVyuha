// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

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

interface IAccessControl {
    function paperAccessCosts(uint256 paperId) external view returns (uint256);
}

contract RevenueSharing {
    IERC20 public rchnToken;
    IPaperPublishing public paperPublishing;
    IAccessControl public accessControl;
    address public platformOwner;
    uint256 public platformFeePercent;

    event RevenueDistributed(
        uint256 indexed paperId,
        address indexed payer,
        uint256 totalAmount,
        uint256 platformShare,
        uint256 authorShare
    );

    constructor(
        address _rchnToken,
        address _paperPublishing,
        address _accessControl,
        address _platformOwner,
        uint256 _platformFeePercent
    ) {
        require(_platformFeePercent <= 100, "Invalid fee percent");
        require(_rchnToken != address(0), "Token address required");
        require(_paperPublishing != address(0), "Publishing address required");
        require(_accessControl != address(0), "AccessControl address required");

        rchnToken = IERC20(_rchnToken);
        paperPublishing = IPaperPublishing(_paperPublishing);
        accessControl = IAccessControl(_accessControl);
        platformOwner = _platformOwner;
        platformFeePercent = _platformFeePercent;
    }

    function distributeAmount(uint256 paperId) external {
        IPaperPublishing.Paper memory paper = paperPublishing.getPaper(paperId);
        require(paper.access == IPaperPublishing.AccessType.PAID, "Paper is not PAID");

        address[] memory authors = paper.authors;
        require(authors.length > 0, "No authors");

        uint256 totalAmount = accessControl.paperAccessCosts(paperId);
        require(totalAmount > 0, "Paper cost not set");

        uint256 platformShare = (totalAmount * platformFeePercent) / 100;
        uint256 remaining = totalAmount - platformShare;
        uint256 authorShare = remaining / authors.length;

        // Transfer full amount from caller
        require(
            rchnToken.transferFrom(msg.sender, address(this), totalAmount),
            "Transfer from user failed"
        );

        // Send platform fee
        require(rchnToken.transfer(platformOwner, platformShare), "Platform transfer failed");

        // Send to authors
        for (uint i = 0; i < authors.length; i++) {
            require(rchnToken.transfer(authors[i], authorShare), "Author transfer failed");
        }

        emit RevenueDistributed(paperId, msg.sender, totalAmount, platformShare, authorShare);
    }
}
