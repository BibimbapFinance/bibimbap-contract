// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity >=0.7.5;

import "./IERC20.sol";

interface IERC20Metadata is IERC20 {

    function name() external view override returns (string memory);

    function symbol() external view override returns (string memory);

    function decimals() external view override returns (uint8);
}
