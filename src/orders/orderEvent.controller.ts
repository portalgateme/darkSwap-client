import { Controller, Get, Param } from '@nestjs/common';
import { ApiGenericArrayResponse } from '../common/response.interface';
import { OrderEventDto } from './dto/orderEvent.dto';
import { OrderManager } from 'darkswap-client-core/dist/orderManagement';
import { DarkSwapClientCore } from 'darkswap-client-core';

@Controller('order-events')
export class OrderEventController {
  private orderManager:OrderManager;

  constructor(private readonly darkSwapClientCore: DarkSwapClientCore) { 
    this.orderManager = darkSwapClientCore.getOrderManager();
  }

  @Get(':orderId')
  @ApiGenericArrayResponse(OrderEventDto)
  async getOrderEvents(@Param('orderId') orderId: string): Promise<OrderEventDto[]> {
    return await this.orderManager.getOrderEvents(orderId);
  }

  @Get('incremental/:lastEventId')
  @ApiGenericArrayResponse(OrderEventDto)
  getIncrementalOrderEvents(@Param('lastEventId') lastEventId: number): Promise<OrderEventDto[]> {
    return this.orderManager.getIncrementalOrderEvents(lastEventId);
  }
} 