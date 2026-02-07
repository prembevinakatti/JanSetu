import hre from "hardhat";

async function main() {
  const CivicChain = await hre.ethers.getContractFactory("CivicChain");

  const civicChain = await CivicChain.deploy();
  await civicChain.waitForDeployment();

  console.log(
    "✅ CivicChain deployed to:",
    await civicChain.getAddress()
  );
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
