// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract PeerReview {
    IERC20 public rewardToken;
    address public admin;
    uint256 public rewardAmount;

    constructor(address _tokenAddress, uint256 _rewardAmount) {
        rewardToken = IERC20(_tokenAddress);
        admin = msg.sender;
        rewardAmount = _rewardAmount;
    }

    struct Review {
        uint256 paperId;
        bytes32 reviewerHash;
        string reviewCID; // IPFS CID of encrypted review file (e.g., JSON)
        uint256 timestamp;
        bool approved;
        address reviewerAddress; // set only on approval (not public in listing)
    }

    Review[] public reviews;

    event ReviewSubmitted(uint256 indexed reviewId, uint256 indexed paperId, bytes32 indexed reviewerHash, string reviewCID);
    event ReviewApproved(uint256 indexed reviewId, address reviewer, uint256 reward);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this");
        _;
    }

    /// @notice Submit a review for a paper
    function submitReview(uint256 _paperId, string calldata _reviewCID) external {
        bytes32 reviewerHash = keccak256(abi.encodePacked(msg.sender, _paperId));

        Review memory review = Review({
            paperId: _paperId,
            reviewerHash: reviewerHash,
            reviewCID: _reviewCID,
            timestamp: block.timestamp,
            approved: false,
            reviewerAddress: address(0)
        });

        reviews.push(review);
        emit ReviewSubmitted(reviews.length - 1, _paperId, reviewerHash, _reviewCID);
    }

    /// @notice Approve a review and reward the reviewer (reviewer must prove ownership off-chain)
    function approveReview(uint256 _reviewId, address _reviewer) external onlyAdmin {
        require(_reviewId < reviews.length, "Invalid review ID");

        Review storage review = reviews[_reviewId];
        require(!review.approved, "Already approved");

        // Verify hash matches
        bytes32 checkHash = keccak256(abi.encodePacked(_reviewer, review.paperId));
        require(checkHash == review.reviewerHash, "Reviewer identity mismatch");

        review.approved = true;
        review.reviewerAddress = _reviewer;

        // Transfer reward
        require(rewardToken.transfer(_reviewer, rewardAmount), "Reward transfer failed");

        emit ReviewApproved(_reviewId, _reviewer, rewardAmount);
    }

    /// @notice Admin can update reward amount
    function updateRewardAmount(uint256 _newAmount) external onlyAdmin {
        rewardAmount = _newAmount;
    }

    /// @notice Get total number of reviews
    function getReviewCount() external view returns (uint256) {
        return reviews.length;
    }

    /// @notice Get public review data (without revealing reviewerAddress)
    function getReview(uint256 _reviewId) external view returns (
        uint256 paperId,
        bytes32 reviewerHash,
        string memory reviewCID,
        uint256 timestamp,
        bool approved
    ) {
        Review storage review = reviews[_reviewId];
        return (
            review.paperId,
            review.reviewerHash,
            review.reviewCID,
            review.timestamp,
            review.approved
        );
    }
}
