import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderEventController } from './orderEvent.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [],
  controllers: [OrderController, OrderEventController],
})
export class OrdersModule {}