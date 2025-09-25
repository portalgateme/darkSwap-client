import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [],
  controllers: [BasicController],
})
export class BasicModule {}