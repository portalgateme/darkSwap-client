import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { DarkpoolContext } from '../common/context/darkpool.context';
import { OrderDto } from './dto/order.dto';
import { UpdatePriceDto } from './dto/updatePrice.dto';
import { OrderService } from './order.service';
import { ApiOperation } from '@nestjs/swagger';
import { CancelOrderDto } from './dto/cancelOrder.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('createOrder')
  async createOrder(@Body() orderDto: OrderDto) {
    const context = await DarkpoolContext.createDarkpoolContext(orderDto.chainId, orderDto.wallet)
    return this.orderService.createOrder(orderDto, context);
  }

  @Post('cancelOrder')
  async cancelOrder(@Body() cancelOrderDto: CancelOrderDto) {
    const context = await DarkpoolContext.createDarkpoolContext(cancelOrderDto.chainId, cancelOrderDto.wallet)
    return this.orderService.cancelOrder(cancelOrderDto.orderId, context);
  }

  @Put('updatePrice')
  async updateOrderPrice(@Body() updatePriceDto: UpdatePriceDto) {
    return await this.orderService.updateOrderPrice(updatePriceDto);
  }

  @ApiOperation({
    description: 'OrderDirection: 0 for buy, 1 for sell<br>' +
      'OrderType: 0 for market, 1 for limit<br>' +
      'TimeInForce: 0 for good till canceled<br>' +
      'StpMode: 0 for none<br>' +
      'OrderStatus: 0 for open, 1 matched, 2 for cancelled<br>'
  })
  @Get('getAllOrders/:status/:page/:limit')
  getAllOrders(@Param('status') status: number, @Param('page') page: number, @Param('limit') limit: number) {
    return this.orderService.getOrdersByStatusAndPage(status, page, limit);
  }

  @ApiOperation({
    description: 'OrderDirection: 0 for buy, 1 for sell<br>' +
      'OrderType: 0 for market, 1 for limit<br>' +
      'TimeInForce: 0 for good till canceled<br>' +
      'StpMode: 0 for none<br>' +
      'OrderStatus: 0 for open, 1 matched, 2 for cancelled<br>'
  })
  @Get('getOrderById/:orderId')
  getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @Get('getAssetPairs')
  getAssetPairs(@Param('chainId') chainId: number) {
    return this.orderService.getAssetPairs(chainId);
  }

}