require('@nomiclabs/hardhat-waffle')
require('@atixlabs/hardhat-time-n-mine')
require('@nomiclabs/hardhat-etherscan')
require('dotenv').config()

const { ethers } = require('ethers')
const dev = process.env.DEV_PRIVATE_KEY
const deployer = process.env.DEPLOYER_PRIVATE_KEY
const etherscanApiKey = process.env.ETHERSCAN_API_KEY
const polygonMainnetRPC = process.env.POLYGON_MAINNET_RPC
const polygonMumbaiRPC = process.env.POLYGON_MUMBAI_RPC
const rinkebyRPC = process.env.RINKEBY_RPC


module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.4',
      },
      {
        version: '0.8.0',
      },
      {
        version: '0.7.5',
      },
      {
        version: '0.6.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    'polygon-mainnet': {
      url: 'https://polygon-rpc.com',
      accounts: [deployer],
      gas: 'auto',
      gasPrice: 80000000000
    },
    'mumbai': {
      url: polygonMumbaiRPC,
      accounts: [dev],
      gasPrice: 35000000000
    },
    'rinkeby': {
      url: rinkebyRPC,
      accounts: [dev],
      gasPrice: 35000000000
    },
    'ganache': {
      url: 'http://127.0.0.1:7545',
      accounts: ['461b3fbb63a4285f2783dc00eae3d26f80cb6625d16516eb2959b89e033845b8'],
      gasPrice: 35000000000
    },
    hardhat: {
      // gas: 'auto',
    //   forking:
    //     process.env.NODE_ENV === 'test'
    //       ? undefined
    //       : {
    //           url: polygonMainnetRPC,
    //         },
    },
  },
  // etherscan: {
  //   apiKey: etherscanApiKey,
  // },
  // mocha: {
  //   timeout: 5 * 60 * 10000,
  // },
}
