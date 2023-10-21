// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.18;

contract HelloWorld {
	string public _message;

	constructor(string memory message) {
		_message = message;
	}

	function updateMessage(string memory message) public {
		_message = message;
	}
}
