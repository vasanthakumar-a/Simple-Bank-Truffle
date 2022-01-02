import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import BankContract from "./contracts/Bank.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: "", balance: 0, amount: 0, web3: null, accounts: null, contract: null, contractBank: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const deployedNetworkBank = BankContract.networks[networkId];
      const BankInstance = new web3.eth.Contract(
        BankContract.abi,
        deployedNetworkBank && deployedNetworkBank.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, contractBank:BankInstance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, contractBank } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set("Vasanth").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });

    contractBank.methods.getBalance().call().then(function(bal) {
      console.log(bal);
      this.setState({ balance: bal });
    }.bind(this))
  };

  setName = (event) => {
    this.state.amount = event;
  }

  // submit function Here:
  deposit = async () => {
    const { amount, accounts, contractBank } = this.state;
    var amt = amount;
    var acc = accounts[0];
    await contractBank.methods.deposite(amt).send({from: acc});
  };

  withdraw = async () => {
    const { amount, accounts, contractBank } = this.state;
    var amt = amount;
    var acc = accounts[0];
    console.log(acc);
    await contractBank.methods.withdraw(amt).send({from: acc});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <div>The stored value is: {this.state.storageValue}</div>

        <input type = "text" id ="amount" onChange={(e) => this.setName(e.target.value)} />
        <p id = "balance">{this.state.balance}</p>
        <button id = "deposit" name="deposit" onClick={this.deposit}>Deposit</button>
        <button id = "withdraw" name="withdraw" onClick={this.withdraw}>Withdraw</button>

      </div>
    );
  }
}

export default App;
