// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NewHabitNFT is ERC1155, Ownable {
    uint public price = 0;
    uint public constant HBT = 0;

    constructor() ERC1155("https://gateway.pinata.cloud/ipfs/Qmb6MDNCKARWCfXdoBRHAihaZc6J8tyeWPCZox8awKZ9J1/{id}.json") {
        _mint(msg.sender, HBT, 1, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setPrice(uint _price) public onlyOwner {
        price = _price;
    }
    
    function mint(address sender, uint256 id, uint256 amount)
        public
        payable 
    {
        // require(msg.value == price);
        _mint(sender, id, amount, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "Balance is 0");
        (bool sent, bytes memory data) = owner().call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function hello() public pure returns(string memory) {
        return "hello world";
    }

    function uri(uint256 _tokenId) override public pure returns (string memory) {
        return string(abi.encodePacked(
            "https://gateway.pinata.cloud/ipfs/Qmb6MDNCKARWCfXdoBRHAihaZc6J8tyeWPCZox8awKZ9J1/", Strings.toString(_tokenId), ".json"));
    }
}

