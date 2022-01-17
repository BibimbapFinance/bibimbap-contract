const { ethers } = require('hardhat')
const airdrop_kaka = require('./airdrop_kaka.json')
const bibimbapNFTABI = require('./bibimbapNFT.abi')

const bibimbapAddress = '0x9E4CFbdb2BBF3BF6B9F17273e9E8b0a11CA29BB4';
const deployer = "0x224C6EcC8d423B6E3f79f8f7C96C3860783F162B";
const airdropAddress = "0x143B70fA7B13B3aEF9887e6c8e933F910d8004CA";
const testnetDeployer = "0xeE5984a7b0F8673519971f3a62E1a413be5ebB83";
const kakarotNFTAddress = "0x473Cbdb25DF3F88d307D2B0EA264A61E65e21228";

async function main() {

  var airdrop2DArr = [];
  const bundleAmount = 100;

  let filteredAirdrop = [];
  for (var i = 0; i < airdrop_kaka.length; i++) {
    if (!ethers.utils.isAddress(airdrop_kaka[i].Content))
      console.log(airdrop_kaka[i].Content + " is not address!");
    else {
      filteredAirdrop.push('"' + airdrop_kaka[i].Content + '"');
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

  console.log(airdrop2DArr[5].toString());
  // console.log(airdrop2DArr[0]);
  // console.log(airdrop2DArr.length);
  console.log(airdrop2DArr[5].length);

  // filteredAirdrop.forEach(res => {
  //   if (res === '0x32d80aa4DEaA68fD56C1AEe7b1Fe1e9a97F2DCBA')
  //   console.log(res);
  // })

  // await airdropNFT(airdrop2DArr);
  }

const airdropNFT = async (arr) => {

  console.log('here airdrop starts!')
  // const KakarotNFT = await ethers.getContractFactory("BibimbapKakarotNFT");
  // const kakarotNFT = BibimbapNFT.attach(bibimbapAddress);

  const KakarotNFT = await ethers.getContractFactory("BibimbapKakarotNFT");
  const kakarotNFT = await KakarotNFT.attach(kakarotNFTAddress);
  
  // console.log("bibimbap NFT address: " + kakarotNFT.address);
  // const mintTx = await kakarotNFT.mint(testnetDeployer, 1, 1000, "0x00");
  // await mintTx.wait();

  const NFTAirdrop = await ethers.getContractFactory('NFTAirdrop')
  const nftAirdrop = await NFTAirdrop.deploy(kakarotNFT.address)
  console.log("deployed NFT airdrop contract!");
  console.log("NFT airdrop address : " + nftAirdrop.address);

  // const NFTAirdrop = await ethers.getContractFactory("NFTAirdrop");
  // const nftAirdrop = NFTAirdrop.attach(airdropAddress);

  const approveTx = await kakarotNFT.setApprovalForAll(nftAirdrop.address, true);
  await approveTx.wait()
  console.log("approved!");

  for (var i = 0; i < arr.length; i++) {
    const airdropTx = await nftAirdrop.airdrop(arr[i])
    await airdropTx.wait()
    console.log("airdrop " + i + " has been done!");
  }

  // const airdropTx = await nftAirdrop.airdrop(testArr);
  // await airdropTx.wait()

  // for (var i = 0; i < arr.length; i++) {
  //   const airdropTx = await nftAirdrop.airdrop(arr[i])
  //   await airdropTx.wait()
  //   console.log("airdrop " + i + " has been done!");
  // }
  
  console.log('Bibimbap NFT has been airdropped. check your NFT!')
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
