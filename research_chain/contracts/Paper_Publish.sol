// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PaperPublishing {
    uint256 public nextPaperId;

    enum AccessType { OPEN, PAID }

    struct Paper {
        string title;
        address[] authors;
        string abstractText;
        string[] keywords;
        uint256 paperId;
        string ipfsHash;
        address publisher;
        uint256 timestamp;
        AccessType access;
    }

    mapping(uint256 => Paper) public papers;

    // ✅ Fixed: map by address, not string
    mapping(address => uint256[]) public papersByPublisher;

    event PaperPublished(
        uint256 indexed paperId,
        string title,
        address[] authors,
        string abstractText,
        string[] keywords,
        string ipfsHash,
        address indexed publisher,
        uint256 timestamp,
        AccessType access
    );

    function publishPaper(
        string memory _title,
        address[] memory _authors,
        string memory _abstractText,
        string[] memory _keywords,
        string memory _ipfsHash,
        AccessType _access
    ) public {
        require(_authors.length > 0, "At least one author required");

        Paper storage newPaper = papers[nextPaperId];
        newPaper.title = _title;
        newPaper.authors = _authors;
        newPaper.abstractText = _abstractText;
        newPaper.keywords = _keywords;
        newPaper.paperId = nextPaperId;
        newPaper.ipfsHash = _ipfsHash;
        newPaper.publisher = msg.sender; // ✅ using sender as publisher
        newPaper.timestamp = block.timestamp;
        newPaper.access = _access;

        papersByPublisher[msg.sender].push(nextPaperId); // ✅ associate with msg.sender

        emit PaperPublished(
            nextPaperId,
            _title,
            _authors,
            _abstractText,
            _keywords,
            _ipfsHash,
            msg.sender,
            block.timestamp,
            _access
        );

        nextPaperId++;
    }

    function getPaper(uint256 _paperId) external view returns (Paper memory) {
        return papers[_paperId];
    }

    function getPapersByPublisher(address _publisher) external view returns (uint256[] memory) {
        return papersByPublisher[_publisher];
    }
}
