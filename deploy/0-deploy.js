
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

const developmentChains = ["hardhat", "localhost"];

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    const celoNfts = await deploy("CeloNFTS", {
        from: deployer,
        args: [deployer],
        log: true,
    })
    // log("________________________________")
    if (
        !developmentChains.includes(network.name) &&
        process.env.CELO_API_KEY
    ) {
        await verify(celoNfts.address, [deployer])
    }
}
module.exports.tags = ["all"]
