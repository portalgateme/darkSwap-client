export interface AssetDto {
    asset: string;
    amount: string;
    lockedAmount: string;
}

export interface MyAssetsDto {
    chainId: number;
    assets: AssetDto[];
}