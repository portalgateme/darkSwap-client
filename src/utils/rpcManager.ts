import { ethers } from 'ethers';
import { ConfigLoader } from './configUtil';
import { WalletConfig } from './configValidator';
import { DarkpoolException } from '../exception/darkpool.exception';
import { GoogleKmsSigner } from '../signer/gcpKmsSigner';

class RpcManager {
  private static instance: RpcManager;
  private providers: Map<number, ethers.JsonRpcProvider>;
  private signers: Map<string, [ethers.Signer, string]>;
  private configLoader: ConfigLoader;

  private constructor() {
    this.providers = new Map();
    this.signers = new Map();
    this.configLoader = ConfigLoader.getInstance();
    this.initializeProviders();
  }

  private initializeProviders() {
    const config = this.configLoader.getConfig();
    config.chainRpcs.forEach(({ chainId, rpcUrl }) => {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      this.providers.set(chainId, provider);
    });
  }

  public static getInstance(): RpcManager {
    if (!RpcManager.instance) {
      RpcManager.instance = new RpcManager();
    }
    return RpcManager.instance;
  }

  public getProvider(chainId: number): ethers.JsonRpcProvider {
    const provider = this.providers.get(chainId);
    if (!provider) {
      throw new Error(`No provider found for chainId: ${chainId}`);
    }
    return provider;
  }

  public getSignerForUserSwapRelayer(chainId: number): ethers.Signer | null {
    const config = this.configLoader.getConfig();
    const userSwapRelayerPrivateKey = config.userSwapRelayerPrivateKey;

    if (!userSwapRelayerPrivateKey) {
      return null;
    }

    const provider = this.getProvider(chainId);
    return new ethers.Wallet(userSwapRelayerPrivateKey, provider);
  }

  public getSignerAndPublicKey(walletAddress: string, chainId: number): [ethers.Signer, string] {
    const key = `${walletAddress}-${chainId}`;
    if (this.signers.has(key)) {
      return this.signers.get(key)!;
    }

    const wallet = this.configLoader.getWallets()
      .find(w => w.address.toLowerCase() === walletAddress.toLowerCase());

    if (!wallet) {
      throw new Error(`No wallet found for address: ${walletAddress}`);
    }

    const provider = this.getProvider(chainId);
    let signer: ethers.Signer;
    if (wallet.type === 'privateKey') {
      signer = this.getSignerForPrivateKey(wallet, provider);
    } else if (wallet.type === 'gcpKms') {
      signer = this.getSignerForGcpKms(wallet, provider);
    } else if (wallet.type === 'awsKms') {
      signer = this.getSignerForAwsKms(wallet, provider);
    } else {
      throw new DarkpoolException('Invalid wallet type');
    }
    const publicKey = "0x";
    this.signers.set(key, [signer, publicKey]);
    return [signer, publicKey];
  }

  private getSignerForPrivateKey(wallet: WalletConfig, provider: ethers.JsonRpcProvider): ethers.Signer {
    if (wallet.type === 'privateKey') {
      return new ethers.Wallet(wallet.privateKey, provider);
    }
    throw new DarkpoolException('Invalid wallet type');
  }

  private getSignerForGcpKms(wallet: WalletConfig, provider: ethers.JsonRpcProvider): ethers.Signer {
    if (wallet.type === 'gcpKms') {
      const signer = new GoogleKmsSigner({
        projectId: wallet.projectId,
        locationId: wallet.locationId,
        keyRingId: wallet.keyRingId,
        cryptoKeyId: wallet.keyId,
        versionId: wallet.versionId,
        credentialsPath: wallet.credentialsPath
      }, provider)
      return signer;
    }
    throw new DarkpoolException('Invalid wallet type');
  }

  private getSignerForAwsKms(wallet: WalletConfig, provider: ethers.JsonRpcProvider): ethers.Signer {

    throw new DarkpoolException('Not implemented');
  }



  public reloadProviders() {
    this.providers.clear();
    this.signers.clear();
    this.initializeProviders();
  }
}

export default RpcManager;
