const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

    const encryptedJsonKey = await wallet.encryptSync(
        process.env.PRIVATE_KEY_PASSWORD,
        process.env.PRIVATE_KEY,
    );
    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
