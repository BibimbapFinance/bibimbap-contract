// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Test2 is ERC20 {
    constructor() ERC20("test2", "tst2") {
        _mint(msg.sender, 3000000 * 10 ** decimals());
    }
}