const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(toAddress, fromAddress, amount) {
    this.toAddress = toAddress;
    this.fromAddress = fromAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, data, previousHash = "") {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;

    this.hash = this.calculateHash();
  }
  calculateHash = () => {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data + this.nonce).toString()
    ).toString();
  };

  mineBlock = (difficulty) => {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("block mined...");
  };
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock = () => {
    return new Block("04/04/2021", "Genesis Block", "0");
  };

  getLatestBlock = () => {
    return this.chain[this.chain.length - 1];
  };

  minePendingTransactions = (miningRewardAddress) => {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
    this.chain.push(block);
  };

  createTransaction = (transaction) => {
    this.pendingTransactions.push(transaction);
  };

  getBalanceOfAddress = (address) => {
    let balance = 0;
    for (const block in chain) {
      for (const trans in block.transaction) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  };

  isValidChain = () => {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }
    return true;
  };
}

let ourCrypto = new BlockChain();
