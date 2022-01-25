// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract NFTAirdrop {
    
    address public bibimbap;

    constructor(address _bibimbap) {
        bibimbap = _bibimbap;
    }

    function airdrop(address[] memory recipients, uint amount) public {
        // require(IERC1155(bibimbap).isApprovedForAll(msg.sender, address(this)), "not approved yet!");
        for (uint i = 0; i < recipients.length; i++) {
            IERC1155(bibimbap).safeTransferFrom(msg.sender, address(recipients[i]), 1, amount, "");
        }
    }
}