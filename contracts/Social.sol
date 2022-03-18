//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Social {

    enum Friend {No, Pending, Yes}

    mapping(address => bool) public isMember;
    mapping(address => mapping(address => Friend)) public areFriends;

    mapping(address => address[]) public friendsList;

    // modifier OnlyMembers {
    //     require(isMember[msg.sender], "Not a member");
    //     _;
    // }

    modifier NotSelf(address addr) {
        require(!(addr == msg.sender), "Can't friend yourself");
        _;
    }

    modifier OnlyFriends(address friend) {
        require(areFriends[msg.sender][friend] == Friend.Yes, "Not friends");
        _;
    }

    modifier OnlyAuthorized(address friend) {
        require(isMember[msg.sender] || areFriends[msg.sender][friend] == Friend.Yes, "Not a member and not friends");
        _;
    }

    //Register membership.
    // function register() public {
    //     require(!isMember[msg.sender], "You're already a member");
    //     isMember[msg.sender] = true;
    // }

    //Register/Remove one or multiple friends.
    function registerFriend(address addr) public NotSelf(addr) {
        if(areFriends[addr][msg.sender] == Friend.No) {
        areFriends[msg.sender][addr] = Friend.Pending;
        } else {
            areFriends[msg.sender][addr] = Friend.Yes;
            areFriends[addr][msg.sender] = Friend.Yes;
            addToFriendList(addr);
        }
    }

    function registerFriends(address[] calldata addrs) public {
        // register();
        for(uint i = 0; i < addrs.length; i++) {
            registerFriend(addrs[i]);
        }
    }

    function removeFriend(address addr) public {
        areFriends[msg.sender][addr] = Friend.No;
        areFriends[addr][msg.sender] = Friend.No;
        removeFromFriendList(addr);
    }

    function removeFriends(address[] calldata addrs) public {
        for(uint i = 0; i < addrs.length; i++) {
            removeFriend(addrs[i]);
        }
    }

    //Return functions

    function returnFriends() public view returns(address[] memory) {
        return friendsList[msg.sender];
    }    

    //Private functions

    function addToFriendList(address addr) private {
        friendsList[msg.sender].push(addr);
        friendsList[addr].push(msg.sender);
    }

    function removeFromFriendList(address addr) private {
        for(uint i = 0; i < friendsList[msg.sender].length; i++) {
            if(friendsList[msg.sender][i] == addr) {
                friendsList[msg.sender][i] = address(0x0);

                for(uint j = 0; j < friendsList[addr].length; j++) {
                    if(friendsList[addr][i] == msg.sender) {
                    friendsList[addr][i] = address(0x0);
                    }
                }
            }
        }
    }

}