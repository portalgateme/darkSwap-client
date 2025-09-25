import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { BasicModule } from './basic/basic.module';
import { AccountModule } from './account/account.module';
import { CommonModule } from './common/common.module';
import { BootstrapService } from './bootstrapService.service';

@Module({
  imports: [
    OrdersModule,  // Import the Orders module
    BasicModule,    // Import the Basic module
    AccountModule,
    CommonModule
  ],
  controllers: [],
  providers: [BootstrapService],
})
export class AppModule {}