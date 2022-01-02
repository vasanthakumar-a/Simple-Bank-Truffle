pragma solidity >=0.4.21 <0.7.0;

contract Bank {
    uint bal;
    
    constructor() public {
        bal = 1;
    }

    function getBalance() view public returns(uint) {
        return (bal);
    }

    function withdraw(uint amt) public {
        bal = bal - amt;
    }

    function deposite(uint amt) public {
        bal = bal + amt;
    }

    
}