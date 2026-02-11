import axios from "axios";
import FormData from "form-data";

export const uploadToPinata = async (file) => {
  const formData = new FormData();

  formData.append("file", file.buffer, {
    filename: file.originalname,
  });

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET,
      },
    }
  );

  return {
    ipfsHash: res.data.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
  };
};
