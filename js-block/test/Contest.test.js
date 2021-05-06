const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../../scripts/compile");

let contest;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  contest = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Giveaway Contract", () => {
  it("can deploy a contract", () => {
    assert.ok(contest.options.address);
  });

  it("can allow an account to enter", async () => {
    await contest.methods.register("Amish", "", "").send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
      gas: "1000000",
    });
    const address = await contest.methods
      .getParticepants()
      .call({ from: accounts[0] });
    assert.equal(accounts[0], address);
  });

  it("require min of ether to enter", async () => {
    try {
      await contest.methods.enter().send({ from: accounts[0], value: 200 });
    } catch (error) {
      assert(error);
    }
  });

  it("can allow multiple accounts to enter", async () => {
    await contest.methods.register("Amish", "", "").send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
      gas: "1000000",
    });

    await contest.methods.register("Amish", "", "").send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
      gas: "1000000",
    });

    await contest.methods.register("Amish", "", "").send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
      gas: "1000000",
    });
    const particepants = await contest.methods
      .getParticepants()
      .call({ from: accounts[0] });
    assert.equal(accounts[0], particepants[0]);
    assert.equal(accounts[1], particepants[1]);
    assert.equal(accounts[2], particepants[2]);
    assert.equal(3, particepants.length);
  });
});
