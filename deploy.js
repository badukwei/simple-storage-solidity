const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
    // Connect to the chain
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    // Set up the wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    // let wallet = ethers.Wallet.fromEncryptedJsonSync(
    // 	encryptedJson,
    // 	process.env.PRIVATE_KEY_PASSWORD
    // );
    // wallet = wallet.connect(provider);

    // Set up the contract you want to deploy
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf8",
    );
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8",
    );

    // Deploy the contract
    console.log("Deploying...");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    const contract = await contractFactory.deploy();
    await contract.deploymentTransaction().wait(1);
    console.log("Deployed!");

    const address = await contract.getAddress();
    console.log(`Contract deployed to ${address}`);

    // Test the contract functionality
    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
    const transactionResponse = await contract.store("7");
    await transactionResponse.wait(1);
    const newFavoriteNumber = await contract.retrieve();
    console.log(`New Favorite Number: ${newFavoriteNumber}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
