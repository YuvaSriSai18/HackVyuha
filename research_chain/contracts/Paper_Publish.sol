// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PaperPublishing {
    uint256 public nextPaperId;

    enum AccessType { OPEN,PAID }

    struct Paper {
        uint256 id;
        string title;
        string ipfsHash;
        address[] authors;
        address publisher;
        uint256 timestamp;
        AccessType access;
    }

    mapping(uint256 => Paper) public papers;

    event PaperPublished(
        uint256 indexed id,
        string title,
        string ipfsHash,
        address[] authors,
        address indexed publisher,
        uint256 timestamp,
        AccessType access
    );

    function publishPaper(
        string memory _title,
        string memory _ipfsHash,
        address[] memory _authors,
        AccessType _access
    ) public {
        require(_authors.length > 0, "At least one author required");

        Paper storage newPaper = papers[nextPaperId];
        newPaper.id = nextPaperId;
        newPaper.title = _title;
        newPaper.ipfsHash = _ipfsHash;
        newPaper.authors = _authors;
        newPaper.publisher = msg.sender;
        newPaper.timestamp = block.timestamp;
        newPaper.access = _access;

        emit PaperPublished(
            nextPaperId,
            _title,
            _ipfsHash,
            _authors,
            msg.sender,
            block.timestamp,
            _access
        );

        nextPaperId++;
    }

    function getPaper(uint256 _paperId) external view returns (Paper memory) {
        return papers[_paperId];
    }
}
