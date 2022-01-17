// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;


import "./interfaces/IERC20.sol";


contract BibimbapStakingWarmup {

    address public immutable staking;
    address public immutable sBBB;

    constructor ( address _staking, address _sBBB ) {
        require( _staking != address(0) );
        staking = _staking;
        require( _sBBB != address(0) );
        sBBB = _sBBB;
    }

    function retrieve( address _staker, uint _amount ) external {
        require( msg.sender == staking );
        IERC20( sBBB ).transfer( _staker, _amount );
    }
}
