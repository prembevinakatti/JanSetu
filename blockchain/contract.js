import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

/* Fix __dirname */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Load ABI */
const artifactPath = path.join(
  __dirname,
  "artifacts",
  "contracts",
  "CivicChain.sol",
  "CivicChain.json"
);

const contractJSON = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
const abi = contractJSON.abi;

/* Provider */
const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC);

/* Wallet */
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

/* Contract */
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);

export default contract;
