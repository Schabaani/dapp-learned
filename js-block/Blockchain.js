const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;

    this.hash = this.calculateHash();
  }
  calculateHash = () => {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data).toString()
    ).toString();
  };
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock = () => {
    return new Block(0, "04/04/2021", "Genesis Block", "0");
  };

  getLatestBlock = () => {
    return this.chain[this.chain.length - 1];
  };

  addBlock = (newBlock) => {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
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

console.log(JSON.stringify(ourCrypto, null, 4));

console.log("is valid? ", ourCrypto.isValidChain());

ourCrypto.chain[1].data = { amount: 43 };
ourCrypto.chain[1].hash = ourCrypto.chain[1].calculateHash();

console.log("is valid? ", ourCrypto.isValidChain());
