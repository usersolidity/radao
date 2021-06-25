const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("RaDAO");
  console.log("contract size", Contract.bytecode.length / 2);
  const contract = await Contract.deploy("K DAO Voting Token", "KDAO");
  await contract.deployed();
  console.log("RaDAO deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
