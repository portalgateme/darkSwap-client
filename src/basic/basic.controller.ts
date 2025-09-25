import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DarkSwapClientCore } from 'darkswap-client-core';
import { AssetManager } from 'darkswap-client-core/dist/assetManagement';
import { DarkSwapSimpleResponse } from '../common/response.interface';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('basic')
export class BasicController {
  private assetManager: AssetManager;

  constructor(private readonly darkSwapClientCore: DarkSwapClientCore) {
    this.assetManager = darkSwapClientCore.getAssetManager();
  }

  @Post('deposit')
  @ApiResponse({
    status: 200,
    description: 'Deposit success',
    type: DarkSwapSimpleResponse
  })
  async deposit(@Body() depositDto: DepositDto) {
    await this.assetManager.deposit(depositDto);
  }

  @Post('withdraw')
  @ApiResponse({
    status: 200,
    description: 'Withdraw success',
    type: DarkSwapSimpleResponse
  })
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    await this.assetManager.withdraw(withdrawDto);
  }
}
