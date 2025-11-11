// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface ICounter {
    event Increment(uint by);
		error MaxValueReached(uint currentValue, uint attemptedIncrement);
    
    function x() external view returns (uint);
    function inc() external;
    function incBy(uint by) external;
}