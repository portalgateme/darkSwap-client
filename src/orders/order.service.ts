import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { CancelOrderDto } from './dto/cancelOrder.dto';
import { Note } from '@thesingularitynetwork/darkpool-v1-proof';
import { DatabaseService } from '../common/db/database.service';
import { DarkpoolContext } from '../common/context/darkpool.context';
import { CreateMakerOrderService, CancelOrderService} from '@thesingularitynetwork/singularity-sdk';
import { NoteBatchJoinSplitService } from 'src/common/noteBatchJoinSplit.service';
import { ConfigLoader } from 'src/utils/configUtil';
import { v4 } from 'uuid';
import axios from 'axios';
import { AssetPairDto } from 'src/common/dto/assetPair.dto';
import { ethers } from 'ethers';
import { OrderDirection } from 'src/types';

interface BookNodeCreateOrderDto {
  chainId: number;
  wallet: string;
  orderId: string;
  assetPairId: string;
  orderDirection: number;
  orderType: number;
  timeInForce: number;
  stpMode: number;
  price: number;
  amountOut: bigint;
  amountIn: bigint;
  partialAmountIn: bigint;
  publicKey: string;
  noteCommitment: string;
  nullifier: string;
  txHashCreated: string;
}


@Injectable()
export class OrderService {
  private static instance: OrderService;
  private dbService: DatabaseService;
  private noteBatchJoinSplitService: NoteBatchJoinSplitService;
  private configLoader: ConfigLoader;

  public constructor() {
    this.dbService = DatabaseService.getInstance();
    this.noteBatchJoinSplitService = NoteBatchJoinSplitService.getInstance();
    this.configLoader = ConfigLoader.getInstance();
  }

  async createOrder(orderDto: OrderDto, darkPoolContext: DarkpoolContext) {
    const createMakerOrderService = new CreateMakerOrderService(darkPoolContext.darkPool);

    const assetPair = await this.dbService.getAssetPairById(orderDto.assetPairId);
    const outDecimals = orderDto.orderDirection === OrderDirection.BUY ? assetPair.quoteDecimal : assetPair.baseDecimal;
    const inDecimals = orderDto.orderDirection === OrderDirection.BUY ? assetPair.baseDecimal : assetPair.quoteDecimal;
    const realAmountOut = ethers.parseUnits(orderDto.amountOut.toString(), outDecimals);
    const realAmountIn = ethers.parseUnits(orderDto.amountIn.toString(), inDecimals);
    const realPartialAmountIn = ethers.parseUnits(orderDto.partialAmountIn.toString(), inDecimals);
    const outAsset = orderDto.orderDirection === 0 ? assetPair.quoteAddress : assetPair.baseAddress;
    const notes = await this.dbService.getNotesByAsset(outAsset, darkPoolContext.chainId);
    const notesToProcess: Note[] = notes.map(note => {
      return {
        note: note.noteCommitment,
        rho: note.rho,
        asset: note.asset,
        amount: note.amount
      } as Note;
    });

    const noteForOrder = await this.noteBatchJoinSplitService.notesJoinSplit(notesToProcess, darkPoolContext, realAmountOut); 
    if(!noteForOrder) {
      throw new Error('No notes to process');
    }
    console.log(noteForOrder);
    const {context, outNotes} = await createMakerOrderService.prepare(noteForOrder,darkPoolContext.signature);
    await createMakerOrderService.generateProof(context);
    const tx = await createMakerOrderService.execute(context);
    if (!orderDto.orderId){
      orderDto.orderId = v4();
    }
    orderDto.status = 0;
    orderDto.nullifier = BigInt(context.proof.outNullifier);
    orderDto.txHashCreated = tx;
    orderDto.publicKey = darkPoolContext.publicKey;

    await this.dbService.addOrderByDto(orderDto);

    delete orderDto.noteCommitment;
    const createOrderRequestDto: BookNodeCreateOrderDto = {
      chainId: orderDto.chainId,
      wallet: orderDto.wallet,
      orderId: orderDto.orderId,
      assetPairId: orderDto.assetPairId,
      orderDirection: orderDto.orderDirection,
      orderType: orderDto.orderType,
      timeInForce: orderDto.timeInForce,
      stpMode: orderDto.stpMode,
      noteCommitment: orderDto.noteCommitment.toString(),
      price: Number(orderDto.price),
      amountOut: realAmountOut,
      amountIn: realAmountIn,
      partialAmountIn: realPartialAmountIn,
      publicKey: orderDto.publicKey,
      nullifier: orderDto.nullifier.toString(),
      txHashCreated: orderDto.txHashCreated
    }
    await axios.post(`${this.configLoader.getConfig().bookNodeApiUrl}/api/orders/create`, createOrderRequestDto,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.configLoader.getConfig().bookNodeApiKey}`
      }
    });
  }

  // Method to cancel an order
  async cancelOrder(orderId: string, darkPoolContext: DarkpoolContext) {
    
    const cancelOrderService = new CancelOrderService(darkPoolContext.darkPool);

    const note = await this.dbService.getNoteByOrderId(orderId);
    
    const noteToProcess = {
      note: note.noteCommitment,
      rho: note.rho,
      asset: note.asset,
      amount: note.amount
    } as Note;

    const cancelOrderDto = {
      orderId: orderId,
      chainId: darkPoolContext.chainId,
      wallet: darkPoolContext.walletAddress
    } as CancelOrderDto;
    
    const {context, outNotes} = await cancelOrderService.prepare(noteToProcess, darkPoolContext.signature);
    await cancelOrderService.generateProof(context);
    await cancelOrderService.execute(context);
    await this.dbService.cancelOrder(cancelOrderDto.orderId);
    await axios.post(`${this.configLoader.getConfig().bookNodeApiUrl}/api/orders/cancel`, cancelOrderDto,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.configLoader.getConfig().bookNodeApiKey}`
      }
    });
  }

  async getOrdersByStatusAndPage(status: number, page: number, limit: number): Promise<OrderDto[]> {
    return await this.dbService.getOrdersByStatusAndPage(status, page, limit);
  }

  async getOrderById(orderId: string): Promise<OrderDto> {
    return await this.dbService.getOrderByOrderId(orderId);
  }

  async getAssetPairs(chainId: number): Promise<AssetPairDto[]> {
    const assetPairs = await this.dbService.getAssetPairs(chainId);
    return assetPairs;
  }
}