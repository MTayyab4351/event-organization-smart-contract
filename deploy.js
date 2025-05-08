const hre = require("hardhat");

async function main() {
  const CreateEvent = await hre.ethers.getContractFactory("createEvenT");
  const eventContract = await CreateEvent.deploy();

  await eventContract.waitForDeployment();

  console.log(`Contract deployed to: ${eventContract.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
