const ethers = require('ethers');
require('dotenv').config();
const myContract = require ("../frontend/assets/newContract.json");

async function main() {

  // Alchemy/Infura HTTP endpoint URL
  const url = process.env.POLYGON_URL; 
  const CONTRACT_ADDRESS = "0x1363aA7Aed5f16d49A7fFF82eEcFc8E91985956B";
  // hook up ethers provider
  const provider = new ethers.providers.JsonRpcProvider(url);

  // copy-paste a private key from a Rinkeby account!
  const privateKey = process.env.PRIVATE_KEY; 

  // let's create a Wallet instance so that our sender can... send!
  const wallet = new ethers.Wallet(privateKey, provider);

  const toAddr = "0xB0D10B8Cc93bD9E70982A9Add5dB5AeDfd5c61d2"; // copy-paste someone from your group!
  const walletBalance = await wallet.getBalance();
  const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, wallet)

  const tx = await connectedContract.donate(1, {value: ethers.utils.parseUnits("10", "wei")});



  // waits for the tx to be mined so that any subsequent queries are accurate
  await tx.wait();
  console.log("Tx hash: " + tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});