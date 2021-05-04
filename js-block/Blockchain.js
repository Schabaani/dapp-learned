const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
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
  }

  createGenesisBlock = () => {
    return new Block(0, "04/04/2021", "Genesis Block", "0");
  };

  getLatestBlock = () => {
    return this.chain[this.chain.length - 1];
  };

  addBlock = (newBlock) => {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
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

ourCrypto.addBlock(new Block(1, "1/1/2022", { amount: 4 }));
ourCrypto.addBlock(new Block(2, "2/1/2022", { amount: 4 }));

console.log(ourCrypto, null, 4);
