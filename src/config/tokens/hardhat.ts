import hardhatContracts from '../contracts/hardhat.json'

export const hardhatTokens = [
    {
        "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "decimals": 18,
        "symbol": "ETH",
        "name": "Ethereum"
    },
    {
        "name": "Tether USD",
        "symbol": "USDT",
        "decimals": 6,
        "address": hardhatContracts.MockUSDC2
    },
    {
        "name": "USD Coin",
        "symbol": "USDC",
        "decimals": 6,
        "address": hardhatContracts.MockUSDC1
    }
]