const { ethers } = require('hardhat')
const airdrop = require('./300_2.json')
// const bibimbapNFTABI = require('./bibimbapNFT.abi')

// const bibimbapAddress = '0x9E4CFbdb2BBF3BF6B9F17273e9E8b0a11CA29BB4';
// const deployer = "0x224C6EcC8d423B6E3f79f8f7C96C3860783F162B";
// const airdropAddress = "0x143B70fA7B13B3aEF9887e6c8e933F910d8004CA";
// const testnetDeployer = "0xeE5984a7b0F8673519971f3a62E1a413be5ebB83";
// const kakarotNFTAddress = "0x473Cbdb25DF3F88d307D2B0EA264A61E65e21228";

async function main() {

  var airdrop2DArr = [];
  const bundleAmount = 20;

  let filteredAirdrop = [];
  for (var i = 0; i < airdrop.length; i++) {
    if (!ethers.utils.isAddress(airdrop[i].Content))
      console.log(airdrop[i].Content + " is not address!");
    else {
      filteredAirdrop.push('"' + airdrop[i].Content + '"');
    }     
  }
  // console.log(filteredAirdrop[0])

  for (var j = 0; j < filteredAirdrop.length; j = j + bundleAmount) {
    var airdropArr = [];
    for (var i = j; i < j + bundleAmount; i++) {
      if (filteredAirdrop[i] === undefined) break
      else {
        airdropArr.push(filteredAirdrop[i]);
      }
    } 
    airdrop2DArr.push(airdropArr);
  }

  const index = 0;
  console.log("index : " + index);
  console.log(airdrop2DArr[index].toString());
  // console.log(airdrop2DArr[0]);
  console.log(airdrop2DArr[index].length);

  // filteredAirdrop.forEach(res => {
  //   if (res === '0x32d80aa4DEaA68fD56C1AEe7b1Fe1e9a97F2DCBA')
  //   console.log(res);
  // })

  // await airdropNFT(airdrop2DArr);
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
