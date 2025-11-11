// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TestContract
 * @dev Comprehensive test contract to validate all signature formats
 */
contract TestContract {
    // ==================== STRUCTS ====================
    
    struct User {
        address wallet;
        uint256 balance;
        string name;
    }
    
    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
    }
    
    struct NestedData {
        User user;
        Transaction[] transactions;
        bytes32 hash;
    }
    
    struct ComplexStruct {
        User[] users;
        Transaction transaction;
        uint256[] values;
        bool active;
    }

    // ==================== STATE VARIABLES ====================
    
    mapping(address => User) public users;
    uint256 public totalSupply;
    
    // ==================== EVENTS ====================
    
    // Simple events
    event SimpleEvent(uint256 value);
    event SimpleEventWithIndexed(address indexed sender, uint256 value);
    
    // Events with multiple indexed parameters
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // Events with structs
    event UserRegistered(User user, uint256 indexed timestamp);
    event TransactionExecuted(Transaction indexed txData, bool success);
    
    // Events with arrays
    event BatchTransfer(address indexed from, address[] to, uint256[] amounts);
    event MultipleUsers(User[] users, uint256 indexed totalCount);
    
    // Events with nested structs
    event NestedEvent(NestedData data, bool indexed verified);
    event ComplexEvent(ComplexStruct complexData, bytes32 indexed hash);
    
    // Events with mixed types
    event MixedEvent(
        address indexed sender,
        User user,
        uint256[] values,
        bytes data,
        bool indexed success
    );

    // ==================== ERRORS ====================
    
    // Simple errors
    error InvalidAmount();
    error Unauthorized(address caller);
    
    // Errors with multiple parameters
    error InsufficientBalance(uint256 available, uint256 required);
    error TransferFailed(address from, address to, uint256 amount, string reason);
    
    // Errors with structs
    error InvalidUser(User user);
    error InvalidTransaction(Transaction txData, string reason);
    
    // Errors with arrays
    error InvalidAddresses(address[] addresses);
    error BatchOperationFailed(uint256[] failedIndexes, string[] reasons);
    
    // Errors with tuples - using structs instead since Solidity doesn't support inline tuples in errors
    error UserLimitsError(User user, uint256 minLimit, uint256 maxLimit);
    
    // Errors with nested structs
    error ComplexError(ComplexStruct data, bytes32 expectedHash);
    
    // Errors with mixed types
    error MixedError(
        address sender,
        User user,
        uint256[] values,
        bool condition
    );

    // ==================== PURE FUNCTIONS ====================
    
    // Simple pure functions
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
    
    function concatenate(string memory a, string memory b) public pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }
    
    // Pure functions with structs
    function validateUser(User memory user) public pure returns (bool) {
        return user.wallet != address(0) && user.balance > 0;
    }
    
    function createTransaction(
        address from,
        address to,
        uint256 amount
    ) public view returns (Transaction memory) {
        return Transaction(from, to, amount, block.timestamp);
    }
    
    // Pure functions with arrays
    function sumArray(uint256[] memory values) public pure returns (uint256 total) {
        for (uint256 i = 0; i < values.length; i++) {
            total += values[i];
        }
    }
    
    function filterUsers(User[] memory userList, uint256 minBalance) 
        public 
        pure 
        returns (User[] memory) 
    {
        uint256 count = 0;
        for (uint256 i = 0; i < userList.length; i++) {
            if (userList[i].balance >= minBalance) count++;
        }
        
        User[] memory filtered = new User[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < userList.length; i++) {
            if (userList[i].balance >= minBalance) {
                filtered[index++] = userList[i];
            }
        }
        return filtered;
    }
    
    // Pure functions with tuples - using memory keyword
    function processTuple(
        address wallet,
        uint256 balance,
        string memory name
    ) public pure returns (bool) {
        return wallet != address(0);
    }
    
    // Pure functions with multiple returns
    function divMod(uint256 a, uint256 b) 
        public 
        pure 
        returns (uint256 quotient, uint256 remainder) 
    {
        quotient = a / b;
        remainder = a % b;
    }
    
    function getUserInfo(User memory user) 
        public 
        pure 
        returns (address wallet, uint256 balance, string memory name) 
    {
        return (user.wallet, user.balance, user.name);
    }
    
    // Pure function with complex nested structures
    function processComplexData(ComplexStruct memory data) 
        public 
        pure 
        returns (uint256 totalUsers, uint256 totalValue) 
    {
        totalUsers = data.users.length;
        for (uint256 i = 0; i < data.values.length; i++) {
            totalValue += data.values[i];
        }
    }

    // ==================== VIEW FUNCTIONS ====================
    
    // Simple view functions
    function getBalance(address account) public view returns (uint256) {
        return users[account].balance;
    }
    
    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }
    
    // View functions with structs
    function getUser(address account) public view returns (User memory) {
        return users[account];
    }
    
    function getUserDetails(address account) 
        public 
        view 
        returns (address wallet, uint256 balance, string memory name) 
    {
        User memory user = users[account];
        return (user.wallet, user.balance, user.name);
    }
    
    // View functions with arrays
    function getBalances(address[] memory accounts) 
        public 
        view 
        returns (uint256[] memory balances) 
    {
        balances = new uint256[](accounts.length);
        for (uint256 i = 0; i < accounts.length; i++) {
            balances[i] = users[accounts[i]].balance;
        }
    }
    
    function getUsers(address[] memory accounts) 
        public 
        view 
        returns (User[] memory userList) 
    {
        userList = new User[](accounts.length);
        for (uint256 i = 0; i < accounts.length; i++) {
            userList[i] = users[accounts[i]];
        }
    }
    
    // View functions with tuples
    function getUserTuple(address account) 
        public 
        view 
        returns (address wallet, uint256 balance, string memory name) 
    {
        User memory user = users[account];
        return (user.wallet, user.balance, user.name);
    }
    
    // View functions with complex returns
    function getComplexData(address account) 
        public 
        view 
        returns (
            User memory user,
            uint256 supply,
            bool exists
        ) 
    {
        user = users[account];
        supply = totalSupply;
        exists = user.wallet != address(0);
    }

    // ==================== PAYABLE FUNCTIONS ====================
    
    // Simple payable functions
    function deposit() public payable {
        users[msg.sender].balance += msg.value;
        totalSupply += msg.value;
    }
    
    function depositFor(address account) public payable {
        users[account].balance += msg.value;
        totalSupply += msg.value;
    }
    
    // Payable functions with parameters
    function depositWithData(string memory data) public payable returns (uint256) {
        users[msg.sender].balance += msg.value;
        emit SimpleEvent(msg.value);
        return msg.value;
    }
    
    function batchDeposit(address[] memory accounts, uint256[] memory amounts) 
        public 
        payable 
        returns (uint256 totalDeposited) 
    {
        require(accounts.length == amounts.length, "Length mismatch");
        require(msg.value >= sumArray(amounts), "Insufficient value");
        
        for (uint256 i = 0; i < accounts.length; i++) {
            users[accounts[i]].balance += amounts[i];
            totalDeposited += amounts[i];
        }
        totalSupply += totalDeposited;
    }
    
    // Payable functions with structs
    function registerUserWithDeposit(User memory user) public payable {
        user.balance += msg.value;
        users[user.wallet] = user;
        emit UserRegistered(user, block.timestamp);
    }
    
    function depositAndTransfer(Transaction memory txData) 
        public 
        payable 
        returns (bool success) 
    {
        require(msg.value >= txData.amount, "Insufficient payment");
        users[txData.from].balance -= txData.amount;
        users[txData.to].balance += txData.amount;
        emit TransactionExecuted(txData, true);
        return true;
    }

    // ==================== REGULAR (NON-PAYABLE) FUNCTIONS ====================
    
    // Simple state-changing functions
    function transfer(address to, uint256 amount) public returns (bool) {
        if (users[msg.sender].balance < amount) {
            revert InsufficientBalance(users[msg.sender].balance, amount);
        }
        
        users[msg.sender].balance -= amount;
        users[to].balance += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    // Functions with structs
    function registerUser(User memory user) public {
        if (user.wallet == address(0)) {
            revert InvalidUser(user);
        }
        users[user.wallet] = user;
        emit UserRegistered(user, block.timestamp);
    }
    
    function updateUser(address account, string memory name, uint256 balance) public {
        users[account].name = name;
        users[account].balance = balance;
    }
    
    // Functions with arrays
    function batchTransfer(address[] memory to, uint256[] memory amounts) 
        public 
        returns (bool) 
    {
        if (to.length != amounts.length) {
            revert InvalidAddresses(to);
        }
        
        for (uint256 i = 0; i < to.length; i++) {
            transfer(to[i], amounts[i]);
        }
        
        emit BatchTransfer(msg.sender, to, amounts);
        return true;
    }
    
    function registerMultipleUsers(User[] memory userList) public {
        for (uint256 i = 0; i < userList.length; i++) {
            registerUser(userList[i]);
        }
        emit MultipleUsers(userList, userList.length);
    }
    
    // Functions with tuples - using Transaction struct instead
    function transferWithData(Transaction memory txData) 
        public 
        returns (bool) 
    {
        users[txData.from].balance -= txData.amount;
        users[txData.to].balance += txData.amount;
        return true;
    }
    
    // Functions with complex nested structures
    function processNestedData(NestedData memory data) 
        public 
        returns (bool verified) 
    {
        registerUser(data.user);
        
        for (uint256 i = 0; i < data.transactions.length; i++) {
            Transaction memory txData = data.transactions[i];
            users[txData.from].balance -= txData.amount;
            users[txData.to].balance += txData.amount;
        }
        
        emit NestedEvent(data, true);
        return true;
    }
    
    function processComplexStruct(ComplexStruct memory data) 
        public 
        returns (uint256 processedCount) 
    {
        for (uint256 i = 0; i < data.users.length; i++) {
            registerUser(data.users[i]);
            processedCount++;
        }
        
        emit ComplexEvent(data, keccak256(abi.encode(data)));
    }
    
    // Functions with multiple complex parameters
    function multipleComplexParams(
        User memory user,
        Transaction[] memory transactions,
        uint256[] memory values,
        ComplexStruct memory complexData
    ) public returns (bool) {
        registerUser(user);
        
        for (uint256 i = 0; i < transactions.length; i++) {
            emit TransactionExecuted(transactions[i], true);
        }
        
        processComplexStruct(complexData);
        return true;
    }
    
    // Functions with mixed indexed and non-indexed events
    function executeWithEvents(
        address sender,
        User memory user,
        uint256[] memory values
    ) public {
        emit MixedEvent(sender, user, values, "", true);
    }
    
    // Function with array of structs representing tuple-like data
    struct AddressAmount {
        address addr;
        uint256 amount;
    }
    
    function processArrayOfTuples(AddressAmount[] memory items) 
        public 
        returns (uint256 total) 
    {
        for (uint256 i = 0; i < items.length; i++) {
            users[items[i].addr].balance += items[i].amount;
            total += items[i].amount;
        }
    }
    
    // ==================== EDGE CASES ====================
    
    // Function with no parameters
    function noParams() public pure returns (uint256) {
        return 42;
    }
    
    // Function with no return value
    function noReturn(uint256 value) public {
        totalSupply = value;
    }
    
    // Function with many parameters
    function manyParams(
        address a1,
        address a2,
        uint256 u1,
        uint256 u2,
        string memory s1,
        string memory s2,
        bool b1,
        bool b2,
        bytes memory data
    ) public pure returns (bool) {
        return b1 && b2;
    }
    
    // Function with unnamed parameters
    function unnamedParams(uint256, address, bytes memory) public pure returns (bool) {
        return true;
    }
    
    // Overloaded functions
    function overloaded(uint256 value) public pure returns (uint256) {
        return value;
    }
    
    function overloaded(uint256 value, string memory name) public pure returns (string memory) {
        return name;
    }
    
    function overloaded(User memory user) public pure returns (address) {
        return user.wallet;
    }
}
