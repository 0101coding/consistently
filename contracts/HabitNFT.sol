//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HabitNFT  is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Base URI
    string private _baseURIextended;

    constructor() ERC721("HabitNFT", "HBT") {
        
    }


     function awardItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        //_setTokenURI(newItemId, string(abi.encodePacked(_baseURI(), "/", newItemId)));
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

}
