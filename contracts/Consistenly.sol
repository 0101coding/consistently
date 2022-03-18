//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0; 

import "./Habit.sol";
import "./HabitNFT.sol";
import "./aave/IPool.sol";
import "./Social.sol";

contract Consistently {
    IPool public aavePool;

    Habit public habit = new Habit();
    HabitNFT public habitNFT = new HabitNFT();
    Social public social = new Social();

    mapping(address => bool) public userAddresses;
    address public owner;
     string private tokenURI = "https://gateway.ipfs.io/ipfs/QmZzT9DAKAjYFgojsfHy252eLFhdp3Zr8f6d9Resui1X21";
     
    uint8 minimumDays  = 1; //change this later
    uint8 maxiumDays = 255;
    uint timeLapse = 43200; // Currently set at 12 hours
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
        aavePool = IPool(0xe91E690407977F0b9fDc655504b895Fe4af0C371);
        // Set the baseURI of the Habit NFT
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
        require(msg.value >= .01 ether, "Minimum Amount of .1 Eth Required");
        require(_days >= minimumDays, "Minimum of 21 days Acceptable");
        require(_days <= maxiumDays, "Maximum of 255 days Acceptable");
        require(userIntentions[msg.sender]==0, "You can only have one habit tracked at a time");

        uint256 currentTime = block.timestamp;
        
        Intention memory intent = Intention(_days, 0, currentTime, msg.value, msg.value, _habit, msg.sender, true);
        intentions.push(intent);
        // Add to list of Addresses. if not already there
        userAddresses[msg.sender] = true;
        social.register();

        uint256 intentionId = intentions.length; // NOTE TO ACCESS YOU NEED TO SUBTRACT 1 FROM INDEX

        // Register the User intention
        userIntentions[msg.sender] = intentionId;
        // Set His last Checkin
        checkInCount[msg.sender] = 0;
        lastCheckIn[msg.sender] = currentTime;
        nextCheckIn[msg.sender] = currentTime + timeLapse; // Next CheckIn Time is in 24 Hours

        emit IntentionRegistered(msg.sender, msg.value, _habit, currentTime, true );
    }
 

    function checkin() external 
        onlyRegisteredUsers(msg.sender) 
        onlyActiveUsers(msg.sender)
        {
        // confirm check in within the current epoch
        uint256 currentTime = block.timestamp;
        require(currentTime > nextCheckIn[msg.sender], "You cannot checkin within 24 Hours"); // Cannot Check In within a 24 Hour Period
        

        
        // This should not be a require. We should still allow the user to checkin after 24hrs have elapsed. 
        //Only that the User needs to be penalized
        if(currentTime > nextCheckIn[msg.sender] + timeLapse){// Must Check In 24 Hours
            penalizeUserForLateCheckIn(msg.sender);
        } 

         
        //DONE: Mint the Token to the User Address
        habit.mint(msg.sender, 1 ether);

        checkInCount[msg.sender] = checkInCount[msg.sender] + 1; // We increate the user Checkin only when they checkin themselves
        lastCheckIn[msg.sender] = currentTime;
        nextCheckIn[msg.sender] = currentTime + timeLapse; // Next CheckIn Time is in 24 Hours
        emit CheckedIn(msg.sender, currentTime);
    }


    function penalizeUserForLateCheckIn(address _userAddress) private {
        require(userIntentions[_userAddress] > 0, "User has no Registered Intention");

        uint intentionId = userIntentions[_userAddress] - 1;
        Intention storage intention = intentions[intentionId];
        // Reduce his Wei Balance by 25%
        intention.weiBalance = intention.weiBalance - (intention.weiDeposited / 4);
        // increment the defaulted
        intention.defaulted++;
        if (intention.defaulted == 4){
            intention.active = false;
            userIntentions[_userAddress] = 0; // reset the userIntention
            //?? Should we set the userAddresses Mapping to false for this user?
        }
    }


    /** @dev Find a way to penalize the user if they do not checkin for 3 days
     Set the User's Last Checkin Time and User's Next Check In
     Emit an event and notify the User that He is penalized.
     Run this every 3 days
    */
    function autoPenalize() internal {
        uint currentTime = block.timestamp;
        for(uint i =0; i < intentions.length; i++){
            //Only fire if the User ia Active
            if (intentions[i].active == true){
                if (currentTime > (nextCheckIn[intentions[i].userAddress] + (86400 * 3))) { // Has not checked in 3 days
                    intentions[i].weiBalance = intentions[i].weiDeposited / 4;
                    intentions[i].defaulted++;

                    // Set his last CheckIn Time
                    lastCheckIn[msg.sender] = currentTime;
                    // Set his next Checkin Time - To avoid repanilzation
                    nextCheckIn[intentions[i].userAddress] = currentTime  + 86400; // 
                    if (intentions[i].defaulted == 4){
                        intentions[i].active = false;
                        userIntentions[intentions[i].userAddress] = 0; // reset the userIntention
                    }
                }
            }
        }
    }


    /** @dev A function to deposit the contract balance into AAVE when it is more than 1 ETH
     This function can be run by Chain link keeper
     This function deposits the contract balance into AAVE 
    */
    function depositIntoAave() public {
        if (address(this).balance > 2 ether){
            aavePool.deposit
                (0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE, address(this).balance, address(this), 0);
        }
    }

    /** @dev A  function to allow the User redeem their Eth balance in the Contract.
        Must not be able to redeem unless quest is completed
        Must burn the habit token once redeemed
        Mint an NFT to the User 
    */
    function redeem()
        external
        onlyRegisteredUsers(msg.sender)
        onlyActiveUsers(msg.sender)
        onlyCompletedQuests(msg.sender)
      {
         // Get the User's Index
        uint intentionId = userIntentions[msg.sender] - 1; // Retrieve the user from the Intentions Array without the need to loop
        Intention storage intention = intentions[intentionId];
        userIntentions[msg.sender]=0;
        // Set the User to Inactive
        intention.active = false; 
        //Reset the Checkin Count
        checkInCount[msg.sender] = 0;

        // Burn the Users habit Token
        habit.burn(msg.sender, habit.balanceOf(msg.sender));
        // Refund the User's Deposit from the Aave Pool
       // aavePool.withdraw(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE, intention.weiBalance, msg.sender);
        // Mint a NFT to the User's Wallet
        habitNFT.awardItem(msg.sender, tokenURI);

    }

    //DONE: Have a external view function to return the user balance, Deposited Wei, Days Remaining, Habit
    function getUserIntention() external view 
        onlyRegisteredUsers(msg.sender)
        onlyActiveUsers(msg.sender)
     returns (Intention memory){
         uint intentionId = userIntentions[msg.sender] - 1;
        Intention memory intention = intentions[intentionId];
        return intention;

    }



    modifier onlyRegisteredUsers(address _userAddress) {
        require(userAddresses[_userAddress], "Only Registed Users Allowed");
        _;
    }
    
    modifier onlyActiveUsers(address _userAddress){
        require(isUserIntentionActive(_userAddress), "Only active users Allowed");
        _;
    }

    modifier onlyActiveQuests(address _userAddress){
        require(hasCompletedQuest(_userAddress) == false, "Quest is no more active");
        _;
    }

    modifier onlyCompletedQuests(address _userAddress){
        require(hasCompletedQuest(_userAddress), "Quest has been completed");
        _;
    }

    /**
        This helper function helps to confirm if the user is active. It is used in the modifier above
    */
    function isUserIntentionActive(address _userAddress) private view returns (bool) {
        require(userIntentions[_userAddress] > 0, "User Intention is not active");

        uint intentionId = userIntentions[_userAddress] - 1;
        Intention memory intention = intentions[intentionId];

        return intention.active;
    }


    /**
    This helper function checks if the User has completed the Quest. The proof we have that the user has completed the quest is
    that the user's habit token matches the number of days he planned to commit for.
     */
    function hasCompletedQuest(address _userAddress) private view returns (bool) {
        uint intentionId = userIntentions[_userAddress] - 1; // Retrieve the user from the Intentions Array without the need to loop
        Intention memory intention = intentions[intentionId];
        return (checkInCount[_userAddress] == intention.noOfDays);
    }

    function withdraw() external payable {
        require(msg.sender==owner, "only owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }

}