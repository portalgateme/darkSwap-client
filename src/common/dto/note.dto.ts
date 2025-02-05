import { BaseDto } from './base.dto';

export class NoteDto extends BaseDto {
    id: number;
    publicKey: string;
    type: number;
    noteCommitment: bigint;
    rho: bigint;
    asset: string;
    amount: bigint;
    status: number;
    txHashCreated: string;
  } 