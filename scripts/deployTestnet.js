// @dev. This script will deploy this V1.1 of Bibimbap. It will deploy the whole ecosystem.

const { ethers } = require('hardhat')
const { BigNumber, ContractFactory } = ethers

const UniswapV2ABI = require('./IUniswapV2Factory.json').abi
const IUniswapV2Pair = require('./IUniswapV2Pair.json').abi
const UniswapV2RouterJson = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
const { getSushiSwapAddresses } = require('./addresses')

async function main() {
  const [deployer] = await ethers.getSigners()
  const daoAddr = '0x0F3ef85dF49b2a90094DC59E0684cBAbB780B6b1'
  console.log('Deploying contracts with the account: ' + deployer.address)

  // Initial staking index
  const initialIndex = '1000000000'

  const { provider } = deployer
  // TODO: set this to launch date
  // const firstEpochTime = (await provider.getBlock()).timestamp + 30 * 60
  const firstEpochTime = 1642134160 // 2022-01-05 15:00
  console.log('First epoch timestamp: ' + firstEpochTime)

  // What epoch will be first epoch
  const firstEpochNumber = '1'

  // How many seconds are in each epoch
  // const epochLengthInSeconds = 86400 / 3
  const epochLengthInSeconds = 60 // 1/480

  // Initial reward rate for epoch
  const initialRewardRate = '5000'

  // Ethereum 0 address, used when toggling changes in treasury
  const zeroAddress = '0x0000000000000000000000000000000000000000'

  // Large number for approval for DAI
  const largeApproval = '100000000000000000000000000000000'

  // Initial mint for DAI (10,000,000)
  const initialMint = '10000000000000000000000000'

  // DAI bond BCV
  const daiBondBCV = '300'

  // Bond vesting length in seconds.
  // const bondVestingLength = 5 * 24 * 3600
  const bondVestingLength = 900

  // Min bond price
  const minBondPrice = '600'

  // Max bond payout, 1000 = 1% of BBB total supply
  const maxBondPayout = '1000'

  // DAO fee for bond
  const bondFee = '10000'

  // Max debt bond can take on
  const maxBondDebt = '8000000000000000'

  // Initial Bond debt
  const initialBondDebt = '0'

  const warmupPeriod = '3'

  const chainId = (await provider.getNetwork()).chainId

  const { router: quickswapRouterAddr, factory: quickswapFactoryAddr } =
    getSushiSwapAddresses(chainId)

  const UniswapV2Router = ContractFactory.fromSolidity(
    UniswapV2RouterJson,
    deployer
  )
  const quickRouter = UniswapV2Router.attach(quickswapRouterAddr)

  // const daiAddr =
  //   chainId === 80001
  //     ? '0x19907af68A173080c3e05bb53932B0ED541f6d20'
  //     : '0x3Ed57914fF5b648DCc32fB7D7c8Ff2738F8Dcff4'

  // Deploy DAI
  const DAI = await ethers.getContractFactory('DAI')
  const dai = await DAI.deploy(80001)
  // const dai = DAI.attach(daiAddr)
  await dai.mint(deployer.address, initialMint);
  console.log('DAI addr: ' + dai.address)

  // Deploy BBB
  const BBB = await ethers.getContractFactory('BibimbapERC20')
  const bbb = await BBB.deploy()
  console.log('BBB deployed: ' + bbb.address)

  const BBBCirculatingSupply = await ethers.getContractFactory(
    'BBBCirculatingSupply'
  )
  const bbbCirculatingSupply = await BBBCirculatingSupply.deploy(
    deployer.address
  )
  await bbbCirculatingSupply.deployTransaction.wait()
  await bbbCirculatingSupply.initialize(bbb.address)

  const uniswapFactory = new ethers.Contract(
    quickswapFactoryAddr,
    UniswapV2ABI,
    deployer
  )
  await (await uniswapFactory.createPair(bbb.address, dai.address)).wait()
  const lpAddress = await uniswapFactory.getPair(bbb.address, dai.address)
  console.log('LP created: ' + lpAddress)

  // Deploy bonding calc
  const BondingCalculator = await ethers.getContractFactory(
    'BibimbapBondingCalculator'
  )
  const bondingCalculator = await BondingCalculator.deploy(bbb.address)

  // Deploy treasury
  const Treasury = await ethers.getContractFactory('BibimbapTreasury')
  const treasury = await Treasury.deploy(
    bbb.address,
    dai.address,
    lpAddress,
    bondingCalculator.address,
    0
  )
  console.log('treasury deployed: ' + treasury.address)

  // Deploy staking distributor
  const StakingDistributor = await ethers.getContractFactory(
    'BibimbapStakingDistributor'
  )
  const stakingDistributor = await StakingDistributor.deploy(
    treasury.address,
    bbb.address,
    epochLengthInSeconds,
    firstEpochTime
  )

  // Deploy sBBB
  const StakedBBB = await ethers.getContractFactory('StakedBibimbapERC20')
  const sBBB = await StakedBBB.deploy()

  // Deploy Staking
  const Staking = await ethers.getContractFactory('BibimbapStaking')
  const staking = await Staking.deploy(
    bbb.address,
    sBBB.address,
    epochLengthInSeconds,
    firstEpochNumber,
    firstEpochTime
  )

  // Deploy staking warmpup
  const StakingWarmup = await ethers.getContractFactory('BibimbapStakingWarmup')
  const stakingWarmup = await StakingWarmup.deploy(
    staking.address,
    sBBB.address
  )

  // Deploy staking helper
  const StakingHelper = await ethers.getContractFactory('BibimbapStakingHelper')
  const stakingHelper = await StakingHelper.deploy(
    staking.address,
    bbb.address
  )

  // Deploy DAI bond
  const DAIBond = await ethers.getContractFactory('BibimbapBondDepository')
  const daiBond = await DAIBond.deploy(
    bbb.address,
    dai.address,
    treasury.address,
    daoAddr,
    zeroAddress
  )

  const DaiBBBBond = await ethers.getContractFactory('BibimbapBondDepository')
  const daiBBBBond = await DaiBBBBond.deploy(
    bbb.address,
    lpAddress,
    treasury.address,
    daoAddr,
    bondingCalculator.address
  )
  const IDO = await ethers.getContractFactory('BibimbapIDO')
  const ido = await IDO.deploy(
    bbb.address,
    dai.address,
    treasury.address,
    staking.address,
    lpAddress
  )

  console.log(
    JSON.stringify({
      sBBB_ADDRESS: sBBB.address,
      BBB_ADDRESS: bbb.address,
      MAI_ADDRESS: dai.address,
      TREASURY_ADDRESS: treasury.address,
      BBB_BONDING_CALC_ADDRESS: bondingCalculator.address,
      STAKING_ADDRESS: staking.address,
      STAKING_WARMUP_ADDRESS: stakingWarmup.address,
      STAKING_DISTRIBUTOR_ADDRESS: stakingDistributor.address,
      STAKING_HELPER_ADDRESS: stakingHelper.address,
      RESERVES: {
        MAI: dai.address,
        MAI_BBB: lpAddress,
      },
      BONDS: {
        MAI: daiBond.address,
        MAI_BBB: daiBBBBond.address,
      },
      IDO: ido.address,
      BBB_CIRCULATING_SUPPLY: bbbCirculatingSupply.address,
    })
  )

  // queue and toggle DAI reserve depositor
  await (await treasury.queue('0', daiBond.address)).wait()
  await treasury.toggle('0', daiBond.address, zeroAddress)

  await (await treasury.queue('0', deployer.address)).wait()
  await treasury.toggle('0', deployer.address, zeroAddress)

  // queue and toggle DAI-BBB liquidity depositor
  await (await treasury.queue('4', daiBBBBond.address)).wait()
  await treasury.toggle('4', daiBBBBond.address, zeroAddress)

  await (await treasury.queue('4', deployer.address)).wait()
  await treasury.toggle('4', deployer.address, zeroAddress)


  // Set bond terms
  await daiBond.initializeBondTerms(
    daiBondBCV,
    bondVestingLength,
    minBondPrice,
    maxBondPayout,
    bondFee,
    maxBondDebt,
    initialBondDebt
  )
  await daiBBBBond.initializeBondTerms(
    '40',
    bondVestingLength,
    minBondPrice,
    maxBondPayout,
    bondFee,
    maxBondDebt,
    initialBondDebt
  )

  // Set staking for bonds
  await daiBond.setStaking(staking.address, stakingHelper.address)
  await daiBBBBond.setStaking(staking.address, stakingHelper.address)

  // Initialize sBBB and set the index
  await sBBB.initialize(staking.address)
  await sBBB.setIndex(initialIndex)

  // set distributor contract and warmup contract
  await staking.setContract('0', stakingDistributor.address)
  await staking.setContract('1', stakingWarmup.address)
  await staking.setWarmup(warmupPeriod)

  // Set treasury for BBB token
  await bbb.setVault(treasury.address)

  // Add staking contract as distributor recipient
  await stakingDistributor.addRecipient(staking.address, initialRewardRate)

  // queue and toggle reward manager
  await (await treasury.queue('8', stakingDistributor.address)).wait(1)
  await treasury.toggle('8', stakingDistributor.address, zeroAddress)

  // const Treasury = await ethers.getContractFactory('BibimbapTreasury')
  // const treasury = Treasury.attach('0x12239Ec193A208343F7FEa8410b7a10cb7DFf9A6')

  // const IDO = await ethers.getContractFactory('BibimbapIDO')
  // const ido = await IDO.deploy(
  //   '0xcf2cf9Aee9A2b93a7AF9F2444843AFfDd8C435eb',
  //   '0x19907af68A173080c3e05bb53932B0ED541f6d20',
  //   '0x12239Ec193A208343F7FEa8410b7a10cb7DFf9A6',
  //   '0x72054987656EA1a801656AD0b9c52FB47aF76419',
  //   '0x3073478d69c4b40ec0BD4BA533536134B633aC71'
  // )
  // console.log('IDO: ' + ido.address)

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
    Math.round(Date.now() / 1000 - 30)
  )

  // queue and toggle ido as reserve depositor
  await (await treasury.queue('0', ido.address)).wait(1)
  await treasury.toggle('0', ido.address, zeroAddress)

  await (await treasury.queue('4', ido.address)).wait(1)
  await treasury.toggle('4', ido.address, zeroAddress)

  // const IDO = await ethers.getContractFactory('BibimbapClamIDO')
  // const ido = IDO.attach('0xC4d9801372e6800D5dBb03eC907CbdDE437bE627')
  // await (await ido.disableWhiteList()).wait()
  // const wallets = []
  // for (let i = 0; i < 1000; i++) {
  //   const wallet = ethers.Wallet.createRandom().connect(deployer.provider)
  //   wallets.push(wallet)
  // }

  // console.log('whitelisting')
  // await (await ido.whiteListBuyers(wallets.map((w) => w.address))).wait()

  const lp = new ethers.Contract(lpAddress, IUniswapV2Pair, deployer)
  // Approve the treasury to spend DAI
  await Promise.all([
    (await dai.approve(treasury.address, largeApproval)).wait(),
    (await dai.approve(daiBond.address, largeApproval)).wait(),
    (await dai.approve(quickRouter.address, largeApproval)).wait(),
    (await bbb.approve(staking.address, largeApproval)).wait(),
    (await bbb.approve(stakingHelper.address, largeApproval)).wait(),
    (await bbb.approve(quickRouter.address, largeApproval)).wait(),
    (await lp.approve(treasury.address, largeApproval)).wait(),
  ])

  // const totalIDODaiAmount = 100 * 10000
  // const bbbMinted = 200000
  // const lpClamAmount = 50000
  // const initialClamPriceInLP = 15
  // const daiInTreasury = totalIDODaiAmount - initialClamPriceInLP * lpClamAmount
  // const profit = daiInTreasury - bbbMinted - lpClamAmount
  // console.log({ daiInTreasury, profit })

  // await (
  //   await treasury.deposit(
  //     ethers.utils.parseEther(String(daiInTreasury)),
  //     dai.address,
  //     BigNumber.from(profit).mul(1e9)
  //   )
  // ).wait()

  // mint lp
  // await (
  //   await quickRouter.addLiquidity(
  //     dai.address,
  //     bbb.address,
  //     ethers.utils.parseEther(String(lpClamAmount * initialClamPriceInLP)),
  //     ethers.utils.parseUnits(String(lpClamAmount), 9),
  //     ethers.utils.parseEther(String(lpClamAmount * initialClamPriceInLP)),
  //     ethers.utils.parseUnits(String(lpClamAmount), 9),
  //     deployer.address,
  //     1000000000000
  //   )
  // ).wait()

  // deposit lp with full profit
  // const lpBalance = await lp.balanceOf(deployer.address)
  // const valueOfLPToken = await treasury.valueOfToken(lpAddress, lpBalance)
  // await treasury.deposit(lpBalance, lpAddress, valueOfLPToken)

  // Stake BBB through helper
  // await stakingHelper.stake(
  //   BigNumber.from(bbbMinted).mul(BigNumber.from(10).pow(9))
  // )

  // Bond 1,000 BBB in each of their bonds
  //   await daiBond.deposit("1000000000000000000000", "60000", deployer.address);
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
