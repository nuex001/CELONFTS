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
const MAIN_RPC_URL =
  process.env.MAIN_RPC_URL ||
  ""
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  ""
const CELO_API_KEY = process.env.CELO_API_KEY || ""
/** @type import('hardhat/config').HardhatUserConfig */
console.log(PRIVATE_KEY);
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: ["0xac5ab03c66fc6c9c708a36ad8b3c2f7d14d5da416c9c3f3169e1edd788c5b37c"],
      chainId: 44787,
    },
    celo: {
      url: "=https://1rpc.io/celo",
      accounts: ["0xac5ab03c66fc6c9c708a36ad8b3c2f7d14d5da416c9c3f3169e1edd788c5b37c"],
      chainId: 42220,
    },
  },
  sourcify: {
    enabled: false,
  },
  etherscan: {
    apiKey: {
      alfajores: CELO_API_KEY,
      celo: CELO_API_KEY
    },
    customChains: [
      {
        network: "alfajores",
        url: "https://alfajores-forno.celo-testnet.org",
        accounts: ["0xac5ab03c66fc6c9c708a36ad8b3c2f7d14d5da416c9c3f3169e1edd788c5b37c"],
        chainId: 44787,
      },
      {
        network: "celo",
        url: "=https://1rpc.io/celo",
        accounts: ["0xac5ab03c66fc6c9c708a36ad8b3c2f7d14d5da416c9c3f3169e1edd788c5b37c"],
        chainId: 42220,
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
