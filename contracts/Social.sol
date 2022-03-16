//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Social {

    enum Friend {No, Pending, Yes}

    mapping(address => bool) public isMember;
    mapping(address => mapping(address => Friend)) public areFriends;

    modifier OnlyMembers {
        require(isMember[msg.sender], "Not a member");
        _;
    }

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
    function register() public {
        require(!isMember[msg.sender], "You're already a member");
        isMember[msg.sender] = true;
    }

    //Register/Remove one or multiple friends.
    function registerFriend(address addr) public OnlyMembers NotSelf(addr) {
        if(areFriends[addr][msg.sender] == Friend.No) {
        areFriends[msg.sender][addr] = Friend.Pending;
        } else {
            areFriends[msg.sender][addr] = Friend.Yes;
            areFriends[addr][msg.sender] = Friend.Yes;
        }
    }

    function registerFriends(address[] calldata addrs) public {
        register();
        for(uint i = 0; i < addrs.length; i++) {
            registerFriend(addrs[i]);
        }
    }

    function removeFriend(address addr) public OnlyMembers {
        areFriends[msg.sender][addr] = Friend.No;
        areFriends[addr][msg.sender] = Friend.No;
    }

    function removeFriends(address[] calldata addrs) public {
        for(uint i = 0; i < addrs.length; i++) {
            removeFriend(addrs[i]);
        }
    }    

}