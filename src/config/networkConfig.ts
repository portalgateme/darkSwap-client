import { HexData, NetworkConfig } from '../types'
import { ChainId } from '../types'
import { hardhatContracts } from './contracts/hardhat'

const confirmationsConfig: { [chainId: number]: number } = {
  [ChainId.MAINNET]: 12,
  [ChainId.ARBITRUM_ONE]: 12,
  [ChainId.BASE]: 6,
  [ChainId.SEPOLIA]: 3,
  [ChainId.BASE_SEPOLIA]: 3,
  [ChainId.HORIZEN_TESTNET]: 3,
  [ChainId.HARDHAT]: 3,
  [ChainId.HARDHAT_ARBITRUM]: 3,
}

const DEFAULT_CONFIRMATIONS = 6;

export function getConfirmations(chainId: number): number {
  return confirmationsConfig[chainId] || DEFAULT_CONFIRMATIONS;
}

export const networkConfig: { [chainId: number]: NetworkConfig } = {
  [ChainId.BASE]: {
    priceOracle: '0xf224a25453D76A41c4427DD1C05369BC9f498444',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0x4200000000000000000000000000000000000006',
    merkleTreeOperator: '0x918B4F76CAE5F67A3818D8eD3d0e11D9888684E9',
    darkSwapAssetManager: '0x6fbA1F1aAb8449b7ba576E41F4617d918391b7cF',
    darkSwapFeeAssetManager: '0xfde341e63EB2f25A32D353d58C2DAd7f91c8Bd57',
    darkSwapSubgraphUrl: 'https://subgraph.thesingularity.network/darkswapBase'
  },
  [ChainId.SEPOLIA]: {
    priceOracle: '0xd9EF5ef50e746B01f471542B1123a23C2Df3168B',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',

    merkleTreeOperator: '0x1992b28C57BdBbB36F775065B45a07E6B9C74571',
    darkSwapAssetManager: '0x7D17139056ac21BDC1B4489492CED5ce3FE95398',
    darkSwapFeeAssetManager: '0x0f9C64736C9141fD4Fb755a46fD46955CE857d2A',
    darkSwapSubgraphUrl: 'https://stage.portalgate.me:18000/subgraphs/name/darkswap'
  },
  [ChainId.BASE_SEPOLIA]: {
    priceOracle: '0xd9EF5ef50e746B01f471542B1123a23C2Df3168B',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',

    merkleTreeOperator: '0xFc4fe255381684867E50062570feF93c2B9f367C',
    darkSwapAssetManager: '0xD4b2352eE460593Cc0D2FA96C0c965B2Ee39e9Eb',
    darkSwapFeeAssetManager: '0x88CD1d66FF8Dbe0b50D7eFaB28a39040B48B6896',
    darkSwapSubgraphUrl: 'https://stage.portalgate.me:28000/subgraphs/name/darkswapBaseSepolia'
  },
  [ChainId.HORIZEN_TESTNET]: {
    priceOracle: '0x54c375f28ce4B0c2B986D6256E4Bc75d242A8793',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',

    merkleTreeOperator: '0xF99969B1Cb7255e8F14741eAFEEdC767e743899a',
    darkSwapAssetManager: '0x25b6A08F81926a918ea0Bb0a0e8Acb4971fAc379',
    darkSwapFeeAssetManager: '0x82751BEe64a937085D842573358Cb8b375A57377',
    darkSwapSubgraphUrl: 'https://stage.portalgate.me:38000/subgraphs/name/darkswapHorizenTestnet'
  },
  [ChainId.HARDHAT]: {
    priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    merkleTreeOperator: hardhatContracts.merkleTreeOperator as HexData,
    darkSwapAssetManager: hardhatContracts.darkSwapAssetManager as HexData,
    darkSwapFeeAssetManager: hardhatContracts.darkSwapFeeAssetManager as HexData,
    darkSwapSubgraphUrl:
      'https://app.dev.portalgate.me:8080/subgraphs/name/singularity/'
  }
}