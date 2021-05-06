const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contestPath = path.resolve(
  __dirname,
  "../js-block/contracts",
  "Contest.sol"
);
const source = fs.readFileSync(contestPath, "utf8");

module.exports = solc.compile(source, 1).contracts[":Contest"];
