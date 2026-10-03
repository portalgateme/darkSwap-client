import { Mutex } from "async-mutex";

export class WalletMutexService {
    private static instance: WalletMutexService;
    private walletMutex: Map<string, Mutex>;

    private constructor() {
        this.walletMutex = new Map<string, Mutex>();
    }

    public static getInstance(): WalletMutexService {
        if (!WalletMutexService.instance) {
            WalletMutexService.instance = new WalletMutexService();
        }
        return WalletMutexService.instance;
    }

    public init(chainId: number, wallets: string[]): void {
        for (const wallet of wallets) {
            this.getMutex(chainId, wallet);
        }
    }

    public getMutex(chainId: number, wallet: string): Mutex {
        const key = `${chainId}:${wallet.toLowerCase()}`;
        if (!this.walletMutex.has(key)) {
            this.walletMutex.set(key, new Mutex());
        }
        return this.walletMutex.get(key)!;
    }

    // Runs fn holding the mutexes of all given addresses, acquired in the given order.
    // Duplicates are taken once: async-mutex is not re-entrant, and a relayer can also be a wallet.
    public async runExclusive<T>(chainId: number, wallets: string[], fn: () => Promise<T>): Promise<T> {
        const mutexes = [...new Set(wallets.map((w) => w.toLowerCase()))].map((w) => this.getMutex(chainId, w));
        const run = (i: number): Promise<T> => i === mutexes.length ? fn() : mutexes[i].runExclusive(() => run(i + 1));
        return run(0);
    }
}