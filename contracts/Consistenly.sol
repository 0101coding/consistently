// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Consistently {
    mapping(address => bool) public userAddresses;
    address public owner;
    uint256 public timestarts;
    
    struct Intention {
        uint8 defaulted; // Only 4 defaults are permitted
        uint256 timeRegistered;
        uint256 weiDeposited;
        bytes32 habitHash;
        address userAddress;
        bool active;
        
    }
    Intention[] public intentions;
    constructor() {
        owner = msg.sender;
    }


    // map the user to his intention id.
    mapping (address => uint) public userIntentions;
    mapping (address => uint) public lastCheckIn;
    mapping (address => uint) public nextCheckIn;

    event IntentionRegistered(address userAddress, uint256 weiDeposited, bytes32 habitHash, uint256 timeRegistered, bool active);
    event CheckedIn(address userAddress, uint256 lastCheckInTime);
    // Allow the user to register what habit they are trying to form or break
    function register(bytes32 _habithash) external payable {
        uint256 currentTime = block.timestamp;
        
        Intention memory intent = Intention(0, currentTime, msg.value, _habithash, msg.sender, true);
        intentions.push(intent);
        // Add to list of Addresses. if not already there
        userAddresses[msg.sender] = true;

        uint256 intentionId = intentions.length; // NOTE TO ACCESS YOU NEED TO SUBTRACT 1 FROM INDEX

        // Register the User intention
        userIntentions[msg.sender] = intentionId;
        // Set His last Checkin
        lastCheckIn[msg.sender] = currentTime;
        nextCheckIn[msg.sender] = currentTime * 86400; // Next CheckIn Time is in 24 Hours

        emit IntentionRegistered(msg.sender, msg.value, _habithash, currentTime, true );
    }

    function checkin() external 
        onlyRegisteredUsers(msg.sender) 
        onlyActiveUsers(msg.sender)
        {
        // confirm check in within the current epoch
        uint256 currentTime = block.timestamp;
        require(currentTime > nextCheckIn[msg.sender]); // Cannot Check In within a 24 Hour Period
        
        // This should not be a require. We should still allow the user to checkin after 24hrs have elapsed. 
        //Only that the User needs to be penalized
        if(currentTime < nextCheckIn[msg.sender] * 86400){// Must Check In 24 Hours
            penalizeUserForLateCheckIn(msg.sender);
        } 

        lastCheckIn[msg.sender] = currentTime;
        nextCheckIn[msg.sender] = currentTime * 86400; // Next CheckIn Time is in 24 Hours
        emit CheckedIn(msg.sender, currentTime);
        
    }


    function penalizeUserForLateCheckIn(address _userAddress) private {
        require(userIntentions[_userAddress] > 0);

        uint intentionId = userIntentions[_userAddress] - 1;
        Intention storage intention = intentions[intentionId];

        intention.weiDeposited -= intention.weiDeposited / 4;
       
        if (intention.defaulted == 4){
            intention.active == false;
            userIntentions[_userAddress] = 0; // reset the userIntention
            //?? Should we set the userAddresses Mapping to false for this user?
        }
    }

    // Explore TimeBased Events. Set the Next Max Min App

    modifier onlyRegisteredUsers(address _userAddress) {
        require(userAddresses[_userAddress]);
        _;
    }
    
    modifier onlyActiveUsers(address _userAddress){
        require(isUserIntentionActive(_userAddress));
        _;
    }

    function isUserIntentionActive(address _userAddress) private view returns (bool) {
        require(userIntentions[_userAddress] > 0);

        uint intentionId = userIntentions[_userAddress] - 1;
        Intention memory intention = intentions[intentionId];

        return intention.active;
    }


}