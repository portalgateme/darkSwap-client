import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DarkSwapClientCore } from 'darkswap-client-core';
import { OrderManager } from 'darkswap-client-core/dist/orderManagement';
import { AssetPairDto } from '../common/dto/assetPair.dto';
import { ApiGenericArrayResponse, ApiGenericResponse, DarkSwapSimpleResponse } from '../common/response.interface';
import { CancelOrderDto } from './dto/cancelOrder.dto';
import { OrderDto } from './dto/order.dto';
import { UpdatePriceDto } from './dto/updatePrice.dto';

@Controller('orders')
export class OrderController {
  private readonly orderManager: OrderManager;


  constructor(private readonly clientCore: DarkSwapClientCore) {
    this.orderManager = this.clientCore.getOrderManager();
  }

  @Post('createOrder')
  @ApiResponse({
    status: 200,
    description: 'Order created',
    type: DarkSwapSimpleResponse
  })
  async createOrder(@Body() orderDto: OrderDto): Promise<void> {
    await this.orderManager.createOrder(orderDto);
  }

  @Delete('cancelOrder')
  @ApiResponse({
    status: 200,
    description: 'Order canceled',
    type: DarkSwapSimpleResponse
  })
  async cancelOrder(@Body() cancelOrderDto: CancelOrderDto) {
    await this.orderManager.cancelOrder(cancelOrderDto);
  }

  @Put('updatePrice')
  @ApiResponse({
    status: 200,
    description: 'Order price updated',
    type: DarkSwapSimpleResponse
  })
  async updateOrderPrice(@Body() updatePriceDto: UpdatePriceDto) {
    await this.orderManager.updateOrderPrice(updatePriceDto);
  }

  @Get('getAllOrders/:status/:page/:limit')
  @ApiGenericArrayResponse(OrderDto)
  getAllOrders(@Param('status') status: number, @Param('page') page: number, @Param('limit') limit: number) {
    return this.orderManager.getAllOrders(status, page, limit);
  }

  @Get('getOrderById/:orderId')
  @ApiGenericResponse(OrderDto)
  async getOrderById(@Param('orderId') orderId: string): Promise<OrderDto> {
    return await this.orderManager.getOrderById(orderId);
  }

  @Get('getAssetPairs')
  @ApiGenericArrayResponse(AssetPairDto)
  getAssetPairs(@Query('chainId') chainId: number) {
    return this.orderManager.getAssetPairs(chainId);
  }
}