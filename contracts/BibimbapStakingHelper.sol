// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import './interfaces/IERC20.sol';
import './interfaces/IBibimbapStaking.sol';

contract BibimbapStakingHelper {
    address public immutable staking;
    address public immutable BBB;

    constructor(address _staking, address _BBB) {
        require(_staking != address(0));
        staking = _staking;
        require(_BBB != address(0));
        BBB = _BBB;
    }

    function stake(uint256 _amount, address _recipient) external {
        IERC20(BBB).transferFrom(msg.sender, address(this), _amount);
        IERC20(BBB).approve(staking, _amount);
        IBibimbapStaking(staking).stake(_amount, _recipient);
        IBibimbapStaking(staking).claim(_recipient);
    }
}
