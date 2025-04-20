import { DarkPool } from "@thesingularitynetwork/singularity-sdk"
import { Signer } from "ethers"
import { networkConfig } from "../config/networkConfig"
import { relayerConfig } from "../config/relayerConfig"
import { stakingTokenConfig } from "../config/stakingConfig"
import { ConfigLoader } from "./configUtil"

export function getDarkPool(chainId: number, signer: Signer) {
    if (!networkConfig[chainId]) {
        throw new Error(`ChainId ${chainId} not supported`)
    }

    const proofOptionConfig = ConfigLoader.getInstance().getConfig().proofOptions;
    let proofOptions;
    if (proofOptionConfig && proofOptionConfig.threads && proofOptionConfig.memory) {
        proofOptions = {
            threads: proofOptionConfig.threads,
            memory: proofOptionConfig.memory
        }
    }

    const darkPool = new DarkPool(
        signer,
        chainId,
        relayerConfig[chainId],
        {
            darkpoolAssetManager: networkConfig[chainId].darkpoolAssetManager,
            stakingAssetManager: networkConfig[chainId].stakingAssetManager,
            complianceManager: networkConfig[chainId].complianceManager,
            merkleTreeOperator: networkConfig[chainId].merkleTreeOperator,
            stakingOperator: networkConfig[chainId].stakingOperator,
            otcSwapAssetManager: networkConfig[chainId].oTCSwapAssetManager,
            priceOracle: networkConfig[chainId].priceOracle,
            ethAddress: networkConfig[chainId].ethAddress,
            nativeWrapper: networkConfig[chainId].nativeWrapper,
            drakpoolSubgraphUrl: networkConfig[chainId].drakpoolSubgraphUrl,
            batchJoinSplitAssetManager: networkConfig[chainId].batchJoinSplitAssetManager,
            darkpoolSwapAssetManager: networkConfig[chainId].darkPoolSwapAssetManager,
        },
        stakingTokenConfig[chainId],
        proofOptions
    )

    return darkPool
}