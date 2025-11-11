// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./ICounter.sol";

contract Counter is ICounter {
    uint public x;

    function inc() public {
        x++;
        emit Increment(1);
    }

    function incBy(uint by) public {
        require(by > 0, "incBy: increment should be positive");
        x += by;
        emit Increment(by);
    }
}
