const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("RaDAO");
  console.log("contract size", Contract.bytecode.length / 2);
  const contract = await Contract.deploy();
  await contract.deployed();

  const Factory = await hre.ethers.getContractFactory("RaDAOFactory");
  const factory = await Factory.deploy(contract.address);
  await factory.deployed();

  const tx = await (
    await factory.create(
      "K DAO Voting Token",
      "KDAO",
      "",
      0,
      500000000000,
      15,
      15
    )
  ).wait();
  const daoAddress = tx.events[tx.events.length - 1].args[0];

  console.log("RaDAO deployed to:", daoAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
