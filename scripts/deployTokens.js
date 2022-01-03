const { ethers } = require('hardhat')
const UniswapV2ABI = require('./IUniswapV2Factory.json').abi
const IUniswapV2Pair = require('./IUniswapV2Pair.json').abi
const { getQuickSwapAddresses } = require('./addresses')

async function main() {

    const [deployer] = await ethers.getSigners()

    const Token1 = await ethers.getContractFactory('Test1');
    const Token2 = await ethers.getContractFactory('Test2');
  
    const token1 = await Token1.deploy();
    const token2 = await Token2.deploy();

    console.log('token1 address : ' + token1.address);
    console.log('token2 address : ' + token2.address);

    const { router: quickswapRouterAddr, factory: quickswapFactoryAddr } =
    getQuickSwapAddresses(80001)

    const uniswapFactory = new ethers.Contract(
        quickswapFactoryAddr,
        UniswapV2ABI,
        deployer
      )

    await (await uniswapFactory.createPair(token1.address, token2.address)).wait()
    const lpAddress = await uniswapFactory.getPair(token1.address, token2.address)
    console.log('LP created: ' + lpAddress)
    
    await token1.transfer(lpAddress, 500000);
    await token2.transfer(lpAddress, 2500000);
    // const lpBalance = await IUniswapV2Pair(lpAddress);
    const Pair = await ethers.getContractAt(IUniswapV2Pair, lpAddress);
    await pair.mint(deployer);
    // const lpBalance = IUniswapV2Pair(maiClamLP).mint(address(this));

}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })