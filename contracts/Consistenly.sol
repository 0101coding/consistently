//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0; 

import "./Habit.sol";
contract Consistently {
 
    Habit internal habit = new Habit();
    mapping(address => bool) public userAddresses;
    address public owner;
    uint256 public timestarts;
    
    struct Intention {
        uint8 noOfDays;
        uint8 defaulted; // Only 4 defaults are permitted
        uint256 timeRegistered;
        uint256 weiDeposited;
        uint256 weiBalance;
        string habit;
        address userAddress;
        bool active;
        
    }
    Intention[] public intentions;
    constructor() {
        owner = msg.sender;
        //TODO: Mint all the Habit Tokens
    }


    // map the user to his intention id.
    mapping (address => uint) public userIntentions;
    mapping (address => uint) public lastCheckIn;
    mapping (address => uint) public nextCheckIn;
    mapping (address => uint8) public checkInCount;

    event IntentionRegistered(address userAddress, uint256 weiDeposited, string habit, uint256 timeRegistered, bool active);
    event CheckedIn(address userAddress, uint256 lastCheckInTime);
    // Allow the user to register what habit they are trying to form or break
    function register(string memory _habit, uint8 _days) external payable {
        require(_days >= 21, "Minimum of 21 days Acceptable");
        require(_days <= 255, "Maximum of 255 days Acceptable");
        uint256 currentTime = block.timestamp;
        
        Intention memory intent = Intention(_days, 0, currentTime, msg.value, msg.value, _habit, msg.sender, true);
        intentions.push(intent);
        // Add to list of Addresses. if not already there
        userAddresses[msg.sender] = true;

        uint256 intentionId = intentions.length; // NOTE TO ACCESS YOU NEED TO SUBTRACT 1 FROM INDEX

        // Register the User intention
        userIntentions[msg.sender] = intentionId;
        // Set His last Checkin
        lastCheckIn[msg.sender] = currentTime;
        nextCheckIn[msg.sender] = currentTime * 86400; // Next CheckIn Time is in 24 Hours

        emit IntentionRegistered(msg.sender, msg.value, _habit, currentTime, true );
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

        
        //DONE: Mint the Token to the User Address
        habit.mint(msg.sender, 1);
        checkInCount[msg.sender]++;
        lastCheckIn[msg.sender] = currentTime;
        nextCheckIn[msg.sender] = currentTime * 86400; // Next CheckIn Time is in 24 Hours
        emit CheckedIn(msg.sender, currentTime);
    }


    function penalizeUserForLateCheckIn(address _userAddress) private {
        require(userIntentions[_userAddress] > 0);

        uint intentionId = userIntentions[_userAddress] - 1;
        Intention storage intention = intentions[intentionId];
        // This line is buggy
        intention.weiBalance = intention.weiDeposited / 4;
        // increment the defaulted
        intention.defaulted++;
        if (intention.defaulted == 4){
            intention.active == false;
            userIntentions[_userAddress] = 0; // reset the userIntention
            //?? Should we set the userAddresses Mapping to false for this user?
        }
    }


    //TODO: Find a way to penalize the user if they do not checkin for a number of days
    // Set the User's Last Checkin Time and User's Next Check In
    // Emit an event and notify the User that He is penalized.
    // Run this every 3 days
    function autoPenalize() internal {
        uint currentTime = block.timestamp;
        for(uint i =0; i < intentions.length; i++){
             if (currentTime > (nextCheckIn[intentions[i].userAddress] + (86400 * 3))) { // Has not checked in 3 days
                intentions[i].weiBalance = intentions[i].weiDeposited / 4;
                intentions[i].defaulted++;
                if (intentions[i].defaulted == 4){
                    intentions[i].active == false;
                    userIntentions[intentions[i].userAddress] = 0; // reset the userIntention
                }
            }
        }
    }


    //TODO Have a function to deposit the contract balance into AAVE when it is more than 1 ETH
    // This function can be run by Chain link keeper
     

    //TODO Have a redeem function to allow the User redeem Eth balance in the Contract.
    // Must not be able to redeem unless quest is completed
    // Must burn the habit token once redeemed
    // Mint an NFT to the User

    //TODO: Have a external view function to return the user balance, Deposited Wei, Days Remaining, Habit
    function getUserIntention() external view 
        onlyRegisteredUsers(msg.sender)
        onlyActiveUsers(msg.sender)
     returns (Intention memory){
         uint intentionId = userIntentions[msg.sender] - 1;
        Intention memory intention = intentions[intentionId];
        return intention;

    }

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