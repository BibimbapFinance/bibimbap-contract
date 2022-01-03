// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Test1 is ERC20 {
    constructor() ERC20("test1", "tst1") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}