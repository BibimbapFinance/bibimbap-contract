const { ethers } = require('hardhat')
const airdrop = require('./airdrop.json')
const bibimbapNFTABI = require('./bibimbapNFT.abi')

const bibimbapAddress = '0x9E4CFbdb2BBF3BF6B9F17273e9E8b0a11CA29BB4';
const deployer = "0x224C6EcC8d423B6E3f79f8f7C96C3860783F162B";
const airdropAddress = "0x5952ACBf0e2ff63b15859519c9ED1B4196a1C99c"
async function main() {
  
  var airdrop2DArr = [];
  const bundleAmount = 50;


  let filteredAirdrop = [];
  for (var i = 0; i < airdrop.length; i++) {
    if (!ethers.utils.isAddress(airdrop[i].Content))
      console.log(airdrop[i].Content + " is not address!");
    else 
      filteredAirdrop.push(airdrop[i].Content);  
  }

  for (var j = 0; j < filteredAirdrop.length; j = j + bundleAmount) {
    var airdropArr = [];
    for (var i = j; i < j + bundleAmount; i++) {
      if (filteredAirdrop[i] === undefined) break
      else {
        airdropArr.push('"' + filteredAirdrop[i].Content + '"');
      }
    } 
    airdrop2DArr.push(airdropArr);
  }

  //51번 보내졌는지 다시 확인해야됨
  //71번도 아직 안함
  // 1 - 51~100
  // 17 - 850~900
  // 18 - 900~950


  //filtered Airdrop
  // 85, 862, 878, 908, 

  // 0x9Da57802a1cEd7E7a577DB05dC8B6Af7623eEA81
  filteredAirdrop.forEach(res => {
    if (res === '0x32d80aa4DEaA68fD56C1AEe7b1Fe1e9a97F2DCBA')
    console.log(res);
  })

  }

const airdropNFT = async (arr) => {

  console.log('here airdrop starts!')
  const BibimbapNFT = await ethers.getContractFactory("BibimbapFinanceNFT");
  const bibimbapNFT = BibimbapNFT.attach(bibimbapAddress);

  // const BibimbapNFT = await ethers.getContractFactory("BibimbapFinanceNFT");
  // const bibimbapNFT = await BibimbapNFT.deploy();
  // const mintTx = await bibimbapNFT.mint(deployer, 1, 30000, "0x00");
  // await mintTx.wait();
  // console.log("bibimbap NFT address: " + bibimbapNFT.address);

  // const NFTAirdrop = await ethers.getContractFactory('NFTAirdrop')
  // const nftAirdrop = await NFTAirdrop.deploy(bibimbapNFT.address)
  // console.log("deployed NFT airdrop contract!");
  // console.log("NFT airdrop address : " + nftAirdrop.address);

  const NFTAirdrop = await ethers.getContractFactory("NFTAirdrop");
  const nftAirdrop = NFTAirdrop.attach(airdropAddress);

  // const approveTx = await bibimbapNFT.setApprovalForAll(nftAirdrop.address, true);
  // await approveTx.wait()
  // console.log("approved!");

  const testArr = [];
  testArr.push("0x295D0C7B423e137C40051da2f055ADfdf18b7c21");

  // const res = await nftAirdrop.bibimbap();
  const airdropTx = await nftAirdrop.airdrop(testArr);
  await airdropTx.wait()

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
