//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Social {

    mapping(address => bool) public isMember;
    mapping(address => mapping(address => bool)) public areFriends; // Member => mapping(Guardian => bool);
    // mapping(address => mapping(address => bool)) public guardianOf; // Guardian => mapping(Member => bool);

    modifier OnlyMembers {
        require(isMember[msg.sender], "not a member");
        _;
    }

    modifier NotSelf(address addr) {
        require(!(addr == msg.sender), "Can't guard yourself");
        _;
    }

    modifier OnlyGuardians(address member) {
        require(areFriends[member][msg.sender], "Not a guardian");
        _;
    }

    modifier OnlyAuthorized(address member) {
        require(isMember[msg.sender] || areFriends[member][msg.sender], "Not a member and not friends");
        _;
    }

    function register() public {
        require(!isMember[msg.sender], "You're already a member");
        isMember[msg.sender] = true;
    }

    function registerGuardian(address addr) public OnlyMembers NotSelf(addr) {
        areFriends[msg.sender][addr] = true;
    }

    function registerGuardians(address[] calldata addrs) public {
        register();
        for(uint i = 0; i < addrs.length; i++) {
            registerGuardian(addrs[i]);
        }
    }

    function removeGuardian(address addr) public OnlyMembers {
        areFriends[msg.sender][addr] = false;
    }

    function removeGuardians(address[] calldata addrs) public {
        for(uint i = 0; i < addrs.length; i++) {
            removeGuardian(addrs[i]);
        }
    }    


}