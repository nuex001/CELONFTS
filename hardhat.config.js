// require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-toolbox")
// require("hardhat-gas-reporter")
require("dotenv").config()
require("@nomiclabs/hardhat-ethers")
require("hardhat-deploy")
require("@nomicfoundation/hardhat-chai-matchers");
/** @type import('hardhat/config').HardhatUserConfig */
const TESTNET_RPC_URL =
  process.env.TESTNET_RPC_URL ||
  ""
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  ""
const CELO_API_KEY = process.env.CELO_API_KEY || ""
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    alfajores: {
      url: TESTNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 44787,
    }
  },
  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: {
      alfajores: CELO_API_KEY,
      celo: "<CELOSCAN_API_KEY>"
    },
    customChains: [
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: `https://api-alfajores.celoscan.io/${CELO_API_KEY}`,
          browserURL: "https://alfajores.celoscan.io",
        },
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: `https://api-alfajores.celoscan.io/${CELO_API_KEY}`,
          browserURL: "https://celoscan.io/",
        },
      },
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  }
};
