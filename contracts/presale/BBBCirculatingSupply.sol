// SPDX-License-Identifier: AGPL-3.0-or-later\
pragma solidity 0.7.5;

import "../interfaces/IERC20.sol";

import "../libraries/SafeMath.sol";

contract BBBCirculatingSupply {
    using SafeMath for uint;

    bool public isInitialized;

    address public BBB;
    address public owner;
    address[] public nonCirculatingBBBAddresses;

    constructor( address _owner ) {
        owner = _owner;
    }

    function initialize( address _bbb ) external returns ( bool ) {
        require( msg.sender == owner, "caller is not owner" );
        require( isInitialized == false );

        BBB = _bbb;

        isInitialized = true;

        return true;
    }

    function bbbCirculatingSupply() external view returns ( uint ) {
        uint _totalSupply = IERC20( BBB ).totalSupply();

        uint _circulatingSupply = _totalSupply.sub( getNonCirculatingBBB() );

        return _circulatingSupply;
    }

    function getNonCirculatingBBB() public view returns ( uint ) {
        uint _nonCirculatingBBB;

        for( uint i=0; i < nonCirculatingBBBAddresses.length; i = i.add( 1 ) ) {
            _nonCirculatingBBB = _nonCirculatingBBB.add( IERC20( BBB ).balanceOf( nonCirculatingBBBAddresses[i] ) );
        }

        return _nonCirculatingBBB;
    }

    function setNonCirculatingBBBAddresses( address[] calldata _nonCirculatingAddresses ) external returns ( bool ) {
        require( msg.sender == owner, "Sender is not owner" );
        nonCirculatingBBBAddresses = _nonCirculatingAddresses;

        return true;
    }

    function transferOwnership( address _owner ) external returns ( bool ) {
        require( msg.sender == owner, "Sender is not owner" );

        owner = _owner;

        return true;
    }
}
