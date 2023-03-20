// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

struct TknDeploymentArgs {
    string _name;
    string _symbol;
    uint256 _decimals;
    uint256 _totalSupply;
}

contract Token {
    string public name;
    string public symbol;
    uint256 public decimals;
    uint256 public totalSupply;

    // Track Balance
    mapping(address => uint256) public balanceOf;

    // Track Allowance
    // allowance(o, s) => [owners: [spenders: [!]]]
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );
    
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(TknDeploymentArgs memory args) {
        name = args._name;
        symbol = args._symbol;
        decimals = args._decimals;
        totalSupply = args._totalSupply * (10**decimals); // << in decimals
        // ! Assign total supply to deployer
        balanceOf[msg.sender] = totalSupply;
    }

    // Send Tokens
    function transfer(address _to, uint256 _value)
        public
        returns(bool success)
    {
        bool userHasEnoughToSend;

        // ! Verify that sender has enough tokens to spend
        userHasEnoughToSend = balanceOf[msg.sender] >= _value;
        require(userHasEnoughToSend);
        
        _transfer(msg.sender, _to, _value);
        
        return true;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        // ! Reject invalid recipient
        require(_to != address(0));

        // Deduct token balance from sender
        balanceOf[_from] = balanceOf[_from] - _value;
        // Credit tokens to receiver
        balanceOf[_to] = balanceOf[_to] + _value;

        emit Transfer(_from, _to, _value);
    }

    // APPROVAL
    function approve(address _spender, uint256 _value)
        public
        returns(bool success)
    {
        // ! Reject invalid spender
        require(_spender != address(0));

        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {

        // check has amount available
        require(_value <= balanceOf[_from]);
        // check approval - DO NOT transfer more than the approved value spec
        require(_value <= allowance[_from][msg.sender]);

        // RESET allowance incrementally
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value; 

        // XFER
        _transfer(_from, _to, _value);
        return true;
    }
}
