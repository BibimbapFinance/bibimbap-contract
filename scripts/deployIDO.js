// @dev. This script will deploy IDO and whitelist it

const { ethers } = require('hardhat')
const { BigNumber } = ethers

const fs = require('fs')
const path = require('path')

const zeroAddress = '0x0000000000000000000000000000000000000000'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account: ' + deployer.address)

  const IDO = await ethers.getContractFactory('OtterClamIDO')
  const ido = await IDO.deploy(
    '0xF6702ADB15520f6ea859d847571459B3B1BA322D', // CLAM
    '0x23E6a9D801cEabdFDAA30A9df3d220569E499061', // MAI
    '0x98780C8560513572fA67500260c344197a35d6E1', // Treasury
    '0x0fE069F4855a5624Ffe00832C8214F377Dea46B5', // Staking
    '0x60805D487dC7Ad355e7386386004F6F56316f79B' // CLAM-MAI LP
  )
  console.log("IDO address : " + ido.address)
  const whiteListBuyers = await ido.whiteListBuyers([
    '0xE51716dB94ec43de4aa66E955f3fC941Cee84472',
    '0xf2a98c5599953c3e4Cdb36781297E5D4d84881c0',
    '0x98cc800c4F5F16C00b506D29A470b04f6938384D',
    '0xeE5984a7b0F8673519971f3a62E1a413be5ebB83'
  ])
  await whiteListBuyers.wait()
  
  await ido.initialize(
    BigNumber.from(200000).mul(BigNumber.from(10).pow(9)),
    BigNumber.from(5).mul(BigNumber.from(10).pow(18)),
    48 * 60 * 60, // 48 hours
    Math.round(Date.now() / 1000)
  )
  const Treasury = await ethers.getContractFactory('OtterTreasury')
  const treasury = Treasury.attach('0x98780C8560513572fA67500260c344197a35d6E1')

  await (await treasury.queue('0', ido.address)).wait(1)
  await treasury.toggle('0', ido.address, zeroAddress)

  await (await treasury.queue('4', ido.address)).wait(1)
  await treasury.toggle('4', ido.address, zeroAddress)
  
  // console.log('Deploy tx: ' + ido.deployTransaction.hash)
  // console.log('Deploy nonce: ' + ido.deployTransaction.nonce)
  // await ido.deployTransaction.wait()
  // console.log('IDO deployed at: ' + ido.address)

  // const ido = IDO.attach('0x7f637Ea843405Dff10592f894292A8f1188166F9')
  // await ido.initialize(
  //   BigNumber.from(200000).mul(BigNumber.from(10).pow(9)),
  //   BigNumber.from(5).mul(BigNumber.from(10).pow(18)),
  //   48 * 60 * 60, // 48 hours
  //   1635724800 // 2021-11-1 0:00 UTC
  // )



  // let whitelist = fs
  //   .readFileSync(path.resolve(__dirname, './whitelist.txt'))
  //   .toString()
  //   .split('\n')
  //   .filter(Boolean)
  // console.log('before listing: ' + whitelist.length)
  // const listMap = {}
  // for (let w of whitelist) {
  //   if (listMap[w.toLowerCase()]) {
  //     console.log('duplicate address: ' + w)
  //   }
  //   listMap[w.toLowerCase()] = true
  // }
  // console.log('white listing: ' + whitelist.length)
  // await (await ido.whiteListBuyers(whitelist, { nonce: 68 })).wait()

  // await treasury.toggle('0', ido.address, zeroAddress)
  // await (await treasury.queue('0', ido.address)).wait(1)
  // await treasury.toggle('0', ido.address, zeroAddress)

  // await (await treasury.queue('4', ido.address)).wait(1)
  // await treasury.toggle('4', ido.address, zeroAddress)
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
