// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SoftwareProvenance {
    address public admin;
    uint256 private nextComponentId = 1;

    enum Role { None, Supplier, Developer, Auditor }
    enum ComponentStatus { Registered, InDevelopment, Tested, Released }

    struct Component {
        uint256 id;
        string name;
        string version;
        bytes32 artifactHash;
        address owner;
        address originalSupplier;
        uint256 createdAt;
        ComponentStatus status;
        bool exists;
    }

    struct ProvenanceRecord {
        string action;
        string details;
        address performedBy;
        uint256 timestamp;
    }

    mapping(address => Role) public roles;
    mapping(uint256 => Component) private components;
    mapping(uint256 => ProvenanceRecord[]) private provenanceHistory;
    mapping(bytes32 => bool) private registeredArtifacts;

    event RoleAssigned(address indexed account, Role role);
    event ComponentRegistered(uint256 indexed componentId, string name, string version, bytes32 artifactHash, address indexed supplier, uint256 timestamp);
    event ComponentTransferred(uint256 indexed componentId, address indexed previousOwner, address indexed newOwner, uint256 timestamp);
    event ProvenanceAdded(uint256 indexed componentId, string action, address indexed performedBy, uint256 timestamp);
    event ComponentVerified(uint256 indexed componentId, address indexed verifier, bool valid, uint256 timestamp);
    event StatusChanged(uint256 indexed componentId, ComponentStatus status, address indexed changedBy);

    constructor() { admin = msg.sender; }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlySupplier() {
        require(roles[msg.sender] == Role.Supplier, "Only suppliers can perform this action");
        _;
    }

    modifier onlyParticipant() {
        require(roles[msg.sender] != Role.None || msg.sender == admin, "Not an authorised participant");
        _;
    }

    modifier componentExists(uint256 id) {
        require(components[id].exists, "Component does not exist");
        _;
    }

    modifier onlyComponentOwner(uint256 id) {
        require(components[id].owner == msg.sender, "Only component owner can perform this action");
        _;
    }

    function assignRole(address account, Role role) external onlyAdmin {
        require(account != address(0), "Invalid account");
        require(role != Role.None, "Invalid role");
        roles[account] = role;
        emit RoleAssigned(account, role);
    }

    function getRole(address account) external view returns (Role) {
        return roles[account];
    }

    function registerComponent(string calldata name, string calldata version, bytes32 artifactHash)
        external onlySupplier returns (uint256)
    {
        require(bytes(name).length > 0, "Component name is required");
        require(bytes(version).length > 0, "Version is required");
        require(artifactHash != bytes32(0), "Artifact hash is required");
        require(!registeredArtifacts[artifactHash], "Artifact already registered");

        uint256 id = nextComponentId++;
        components[id] = Component(id, name, version, artifactHash, msg.sender, msg.sender, block.timestamp, ComponentStatus.Registered, true);
        registeredArtifacts[artifactHash] = true;

        provenanceHistory[id].push(ProvenanceRecord("REGISTERED", "Software component registered", msg.sender, block.timestamp));
        emit ComponentRegistered(id, name, version, artifactHash, msg.sender, block.timestamp);
        return id;
    }

    function transferComponent(uint256 id, address newOwner)
        external componentExists(id) onlyComponentOwner(id)
    {
        require(newOwner != address(0), "Invalid new owner");
        require(roles[newOwner] != Role.None, "New owner is not authorised");
        require(newOwner != msg.sender, "Cannot transfer to current owner");

        address previousOwner = components[id].owner;
        components[id].owner = newOwner;
        provenanceHistory[id].push(ProvenanceRecord("TRANSFERRED", "Component ownership transferred", msg.sender, block.timestamp));
        emit ComponentTransferred(id, previousOwner, newOwner, block.timestamp);
    }

    function addProvenanceRecord(uint256 id, string calldata action, string calldata details)
        external componentExists(id) onlyParticipant
    {
        require(bytes(action).length > 0, "Action is required");
        provenanceHistory[id].push(ProvenanceRecord(action, details, msg.sender, block.timestamp));
        emit ProvenanceAdded(id, action, msg.sender, block.timestamp);
    }

    function updateStatus(uint256 id, ComponentStatus status)
        external componentExists(id) onlyComponentOwner(id)
    {
        components[id].status = status;
        provenanceHistory[id].push(ProvenanceRecord("STATUS_UPDATED", getStatusName(status), msg.sender, block.timestamp));
        emit StatusChanged(id, status, msg.sender);
    }

    function verifyComponent(uint256 id, bytes32 currentHash)
        external componentExists(id) returns (bool)
    {
        bool valid = components[id].artifactHash == currentHash;
        emit ComponentVerified(id, msg.sender, valid, block.timestamp);
        return valid;
    }

    function checkComponentHash(uint256 id, bytes32 currentHash)
        external view componentExists(id) returns (bool)
    {
        return components[id].artifactHash == currentHash;
    }

    function getComponent(uint256 id) external view componentExists(id) returns (Component memory) {
        return components[id];
    }

    function getProvenanceHistory(uint256 id) external view componentExists(id) returns (ProvenanceRecord[] memory) {
        return provenanceHistory[id];
    }

    function getComponentCount() external view returns (uint256) {
        return nextComponentId - 1;
    }

    function getStatusName(ComponentStatus status) internal pure returns (string memory) {
        if (status == ComponentStatus.Registered) return "Registered";
        if (status == ComponentStatus.InDevelopment) return "In Development";
        if (status == ComponentStatus.Tested) return "Tested";
        return "Released";
    }
}
