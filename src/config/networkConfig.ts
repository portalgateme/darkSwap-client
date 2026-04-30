import { HexData, NetworkConfig } from '../types'
import { ChainId } from '../types'
import hardhatContracts from './contracts/hardhat.json'
import { hardhatBaseContracts } from './contracts/hardhatBase'
import sepolia from './contracts/sepolia.json'
import baseSepolia from './contracts/baseSepolia.json'
import horizenTestnet from './contracts/horizenTestnet.json'

const confirmationsConfig: { [chainId: number]: number } = {
  [ChainId.MAINNET]: 12,
  [ChainId.ARBITRUM_ONE]: 12,
  [ChainId.BASE]: 6,
  [ChainId.SEPOLIA]: 3,
  [ChainId.HARDHAT]: 3,
  [ChainId.HARDHAT_BASE]: 3,
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
    darkSwapAssetManager: '0x43f3Af9133f61b79eD4683Deb201E5FDbA42DBE9',
    darkSwapFeeAssetManager: '0x5D130d32A962c1F86A9378d07b60b46De86e6855',
    darkSwapPartialAssetManager: '0x0',
    darkSwapSubgraphUrl: 'https://subgraph.thesingularity.network/darkswapBase'
  },
  [ChainId.SEPOLIA]: {
    priceOracle: '0xd9EF5ef50e746B01f471542B1123a23C2Df3168B',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    merkleTreeOperator: sepolia.merkleTreeOperator as HexData,
    darkSwapAssetManager: sepolia.darkSwapAssetManager as HexData,
    darkSwapFeeAssetManager: sepolia.darkSwapFeeAssetManager as HexData,
    darkSwapPartialAssetManager: sepolia.darkSwapPartialAssetManager as HexData,
    darkSwapSubgraphUrl: 'https://api.goldsky.com/api/public/project_cmgzjxdql005h5np27j8qhmdj/subgraphs/darkswapSepolia/0.0.1/gn'
  },
  [ChainId.BASE_SEPOLIA]: {
    priceOracle: '0x0',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0x0',
    merkleTreeOperator: baseSepolia.merkleTreeOperator as HexData,
    darkSwapAssetManager: baseSepolia.darkSwapAssetManager as HexData,
    darkSwapFeeAssetManager: baseSepolia.darkSwapFeeAssetManager as HexData,
    darkSwapPartialAssetManager: baseSepolia.darkSwapPartialAssetManager as HexData,
    darkSwapSubgraphUrl: 'https://testnet.portalgate.me:28000/subgraphs/name/darkSwap'
  },
  [ChainId.HORIZEN_TESTNET]: {
    priceOracle: '0x54c375f28ce4B0c2B986D6256E4Bc75d242A8793',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    merkleTreeOperator: horizenTestnet.merkleTreeOperator as HexData,
    darkSwapAssetManager: horizenTestnet.darkSwapAssetManager as HexData,
    darkSwapFeeAssetManager: horizenTestnet.darkSwapFeeAssetManager as HexData,
    darkSwapPartialAssetManager: horizenTestnet.darkSwapPartialAssetManager as HexData,
    darkSwapSubgraphUrl: 'https://bb.subgraph.thesingularity.network/subgraphs/name/singularity/'
  },
  [ChainId.HARDHAT]: {
    priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    merkleTreeOperator: hardhatContracts.merkleTreeOperator as HexData,
    darkSwapAssetManager: hardhatContracts.darkSwapAssetManager as HexData,
    darkSwapFeeAssetManager: hardhatContracts.darkSwapFeeAssetManager as HexData,
    darkSwapPartialAssetManager: hardhatContracts.darkSwapPartialAssetManager as HexData,
    darkSwapSubgraphUrl:
      'https://app.dev.portalgate.me:8080/subgraphs/name/darkswap/'
  }
}