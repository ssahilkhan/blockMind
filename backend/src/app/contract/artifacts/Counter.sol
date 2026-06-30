// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public counter;

    event CounterUpdated(uint256 value);

    constructor(uint256 _initialValue) {
        counter = _initialValue;
    }

    function increment() public {
        counter += 1;
        emit CounterUpdated(counter);
    }

    function decrement() public {
        require(counter > 0, "Counter: cannot decrement below zero");
        counter -= 1;
        emit CounterUpdated(counter);
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
