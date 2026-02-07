// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CivicChain {

   enum Status {
    Reported,
    InProgress,
    Resolved
}

struct Issue {
    uint256 issueId;
    address reporter;
    string issueHash;     
    Status currentStatus;
    uint256 createdAt;
}

struct IssueLog {
    Status status;
    address updatedBy;
    uint256 timestamp;
    string proofHash;     
}

address public owner;
uint256 public issueCounter;

mapping (address => bool) public  admins;
mapping (uint256 => Issue) private issues;
mapping (uint256 => IssueLog[]) private issueHistory;

modifier onlyOwner() {
    require(msg.sender == owner, "Only owner");
    _;
}

modifier onlyAdmin() {
    require(admins[msg.sender], "Only admin");
    _;
}

    event IssueCreated(uint256 indexed issueId, address indexed reporter);
    event StatusUpdated(
        uint256 indexed issueId,
        Status status,
        address indexed updatedBy,
        string proofHash
    );

constructor() {
        owner = msg.sender;
        admins[msg.sender] = true; // deployer is admin
    }

    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
    }

function createIssue(string memory _issueHash) external {
    issueCounter++;

    issues[issueCounter] = Issue({
        issueId : issueCounter,
        reporter : msg.sender,
        issueHash : _issueHash,
        currentStatus : Status.Reported,
        createdAt : block.timestamp
    });

    issueHistory[issueCounter].push(
        IssueLog({
            status : Status.Reported,
            updatedBy : msg.sender,
            timestamp : block.timestamp,
            proofHash : ""
        })
    );

    emit IssueCreated(issueCounter, msg.sender);

}

function updateIssueStatus(
    uint256 _issueId,
    Status _status,
    string memory _proofHash
) external onlyAdmin {
    require(_issueId > 0 && _issueId <= issueCounter, "Invalid issue");

    issues[_issueId].currentStatus = _status;

    issueHistory[_issueId].push(
        IssueLog({
            status : _status,
            updatedBy : msg.sender,
            timestamp: block.timestamp,
                proofHash: _proofHash
        })
    );

     emit StatusUpdated(_issueId, _status, msg.sender, _proofHash);
}

function getIssue(uint256 _issueId) external  view returns (Issue memory) {
    return issues[_issueId];
}

function getIssueHistory(uint256 _issueId)
        external
        view
        returns (IssueLog[] memory)
    {
        return issueHistory[_issueId];
    }

}
