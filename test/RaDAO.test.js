const { BN, constants } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { shouldBehaveLikeERC20 } = require("./ERC20.behavior");
const { ZERO_ADDRESS } = constants;
const P = ethers.utils.parseUnits;
const F = ethers.utils.formatUnits;

describe("RaDAO", function () {
  const name = "XYZ DAO Token";
  const symbol = "XYZDAO";
  let initialHolder;
  let recipient;
  let anotherAccount;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    initialHolder = await signers[0].getAddress();
    recipient = await signers[1].getAddress();
    anotherAccount = await signers[2].getAddress();

    const RaDAO = await ethers.getContractFactory("RaDAO");
    const RaDAOFactory = await ethers.getContractFactory("RaDAOFactory");

    this.template = await RaDAO.deploy();
    await this.template.deployed();
    this.factory = await RaDAOFactory.deploy(this.template.address);
    await this.factory.deployed();
    const tx = await (
      await this.factory.create(
        name,
        symbol,
        this.template.address,
        0,
        50,
        15,
        15
      )
    ).wait();
    const daoAddress = tx.events[tx.events.length - 1].args[0];
    this.token = RaDAO.attach(daoAddress);
  });

  it("has a name", async function () {
    expect(await this.token.name()).to.equal(name);
  });

  it("has a symbol", async function () {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  it("has 18 decimals", async function () {
    expect(F(await this.token.decimals(), 0)).to.be.equal("18");
  });

  describe("total supply", function () {
    it("returns the total amount of tokens", async function () {
      expect(F(await this.token.totalSupply())).to.be.equal("0");
    });
  });

  describe("balanceOf", function () {
    describe("when the requested account has no tokens", function () {
      it("returns zero", async function () {
        expect(F(await this.token.balanceOf(anotherAccount))).to.be.equal(
          "0.0"
        );
      });
    });
  });

  return;
  shouldBehaveLikeERC20(
    "",
    ethers.BigNumber.from("0"),
    () => initialHolder,
    () => recipient,
    () => anotherAccount
  );
});
