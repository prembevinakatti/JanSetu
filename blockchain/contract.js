import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* Fix __dirname in ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Load ABI safely */
const artifactPath = path.join(
  __dirname,
  "artifacts",
  "contracts",
  "CivicChain.sol",
  "CivicChain.json",
);

// console.log(process.env.PRIVATE_KEY);
// console.log(process.env.PRIVATE_KEY?.length);

const contractJSON = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
const abi = contractJSON.abi;

/* Provider (Polygon Amoy) */
const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC);

/* Wallet (Admin / System wallet) */
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

/* Contract instance */
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

export default contract;
