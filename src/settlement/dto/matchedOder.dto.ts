
export class MatchedOrderDto {
    orderId: string;
    chainId: number;
    assetPairId: string;
    orderDirection: number;
    isAlice: boolean;
    isMarket: boolean;
    isPartial: boolean;
    // Set when Bob's taker order is a leftover follow-up child. Alice-side
    // settlement then routes to ProMarketPartialLeftOverOrderSwapService.
    isLeftOver: boolean;
    aliceAmount: bigint;
    aliceMatchedAmount: bigint;
    bobMatchedAmount: bigint;
    alicePublicKey: string;
    bobPublicKey: string;
    aliceSwapMessage: string;
    bobSwapMessage: string;
}