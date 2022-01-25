const { ethers } = require('hardhat')

const addresses = {
    sBBB_ADDRESS: '0x1360eFed295566F1bFd17F6119c64323a2c97ee0',
    BBB_ADDRESS: '0x5763c4F72466138c605A026aD43F4B9834FCBd4e',
    OLD_BBB_ADDRESS: '0x437D943931903057673618FCA772E8Ff21069D66', // *
    OLD_SBBB_ADDRESS: '0x19a41AdAB9b1D1febCC27Fc278847efd013c28c2', // *
    MAI_ADDRESS: '0xC51b0FfaEbB769b1f858f1788FAB2cC50AEc2eb8',
    TREASURY_ADDRESS: '0x3D837Dba9f355e1bf16604Ae87FAe35f7Ed1e888',
    OLD_TREASURY: '0xD20691b96a12EB03d4fB18Ed24b2244393bC7e27', // *
    BBB_BONDING_CALC_ADDRESS: '0x36Bc601c035407fF038D08dc07F445bd2Fb3B1a4',
    STAKING_ADDRESS: '0xe27d2226b053F8A0416F4Fa6a022645452Ff2da1',
    STAKING_WARMUP_ADDRESS: '0x3c6d85871627859cDB60496F221CAdFA9447555E',
    STAKING_DISTRIBUTOR_ADDRESS: '0x3e3AD080a27b112967899fD07366789b274F2309',
    OLD_STAKING_ADDRESS: '0x96df4a396b11BDEc19dB90A239cf51ce4D582268', // *
    STAKING_HELPER_ADDRESS: '0x67Ae3D1FBBbAdde6b8966C2998E62fba2418329A',
    MIGRATOR: '0xDaa1f5036eC158fca9E5ce791ab3e213cD1c41df', // *
    RESERVES: {
      MAI: '0xC51b0FfaEbB769b1f858f1788FAB2cC50AEc2eb8',
      OLD_MAI_CLAM: '0x578cEa575734D4d3A3Fb68872e41535746E375bE', // *
      MAI_BBB: '0x4a024f7D496c29b181D47A75625ddeEDA3Ac391a',
    },
    BONDS: {
      MAI: '0x3Fc1835F000Ab81BAE21c65Ed4B06A03c56d98c0',
      MAI_BBB: '0x5eDa1231410Ca526a83951283166d34F1c161909',
      OLD_MAI: '0x049bf8be5033624aFA213F821116a4E80445864c', // *
      OLD_MAI_BBB: '0x7091cEEB04A1574eBBA2B75F7E78b16aa39CA9b8', // *
      OLD_MAI_BBB_V2: '0x79d963D5Bf809FfAa4e1c1268fD552d4E3982bC6', // *
    },
    IDO: '0x2F5Ef8de24be6b4787a9e73492745caceED83a52',
    BBB_CIRCULATING_SUPPLY: '0x367B1937818051E43fFbA4ECe68c0B2bde9dCaA7',
  };
  const fraxAddress = '0x1Fd7eEb2E1d6ee26B5FE55B0E8Eb8647AC307Dd8'
  const fraxBondAddress = '0x926b959BBE06813e89d76fD2B358567a47dfe728'
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const daoAddr = '0x0F3ef85dF49b2a90094DC59E0684cBAbB780B6b1'

async function main() {
    // const FRAX = await ethers.getContractFactory('FRAX')
    // const frax = await FRAX.deploy(80001)
    // // const dai = DAI.attach(daiAddr)
    // const initialMint = '10000000000000000000000000'

    // await frax.mint(deployer.address, initialMint);
    // console.log('FRAX addr: ' + frax.address)

    const Treasury = await ethers.getContractFactory('BibimbapTreasury')
    const treasury = Treasury.attach(addresses.TREASURY_ADDRESS)
    console.log("bibimbap treasury")

    const BibimbapBondStakeDepository = await ethers.getContractFactory(
        'BibimbapBondStakeDepository'
    )

    console.log("Autostake")

    // const fraxBond = await BibimbapBondStakeDepository.deploy(
    //     addresses.BBB_ADDRESS,
    //     addresses.sBBB_ADDRESS,
    //     fraxAddress,
    //     addresses.TREASURY_ADDRESS,
    //     daoAddr,
    //     zeroAddress
    // )

    const fraxBond = await BibimbapBondStakeDepository.attach(fraxBondAddress)

    console.log("fraxBond address : " + fraxBond.address)

    // await (await treasury.queue('2', fraxAddress)).wait()
    // await treasury.toggle('2', fraxAddress, zeroAddress)
  
    // await (await treasury.queue('0', fraxBond.address)).wait()
    // await treasury.toggle('0', fraxBond.address, zeroAddress)

    const fraxBondBCV = '300'

    // Bond vesting length in seconds.
    // const bondVestingLength = 5 * 24 * 3600
    const bondVestingLength = 900
  
    // Min bond price
    const minBondPrice = '1350'
  
    // Max bond payout, 1000 = 1% of BBB total supply
    const maxBondPayout = '1000'
  
    // DAO fee for bond
    const bondFee = '10000'
  
    // Max debt bond can take on
    const maxBondDebt = '8000000000000000'
  
    // Initial Bond debt
    const initialBondDebt = '0'

    // await fraxBond.initializeBondTerms(
    //     fraxBondBCV,
    //     bondVestingLength,
    //     minBondPrice,
    //     maxBondPayout,
    //     bondFee,
    //     maxBondDebt,
    //     initialBondDebt
    //   )
      
    await fraxBond.setStaking(addresses.STAKING_ADDRESS)  
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
