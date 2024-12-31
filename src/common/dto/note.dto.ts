import { BaseDto } from './base.dto';

export class noteDto extends BaseDto {
    id: number;
    publicKey: string;
    type: string;
    noteCommitment: bigint;
    rho: bigint;
    asset: string;
    amount: bigint;
    status: number;
    txHashCreated: string;
  } 