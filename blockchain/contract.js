const { ethers } = require("ethers");
const contractABI = require("./artifacts/contracts/CIvicChain.sol/CivicChain.json");

// Provider (Polygon Amoy)
const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC);

// Wallet (Admin / System wallet)
const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

// Contract instance
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

module.exports = contract;
