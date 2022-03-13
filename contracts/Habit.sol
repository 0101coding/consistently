//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract Habit is ERC20, Ownable {
    constructor() ERC20("Habit", "HBT"){
        
    }

    function mint(address account, uint256 amount)  public onlyOwner virtual {
        super._mint(account, amount);
    }

    function burn(address account, uint256 amount)  public onlyOwner virtual {
        super._burn(account, amount);
    }
 

}