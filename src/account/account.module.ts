import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AccountController } from './account.controller';

@Module({
  imports: [CommonModule],
  providers: [],
  controllers: [AccountController],
})
export class AccountModule {}