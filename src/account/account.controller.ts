import { Body, Controller, Get, Post } from '@nestjs/common';
import { DarkSwapClientCore } from 'darkswap-client-core';
import { AssetManager } from 'darkswap-client-core/dist/assetManagement';
import { BaseDto } from '../common/dto/base.dto';
import { ApiGenericResponse } from '../common/response.interface';
import { MyAssetsDto } from './dto/asset.dto';
import { SyncAssetDto } from './dto/syncAsset.dto';


@Controller('account')
export class AccountController {
  private assetManager: AssetManager;

  constructor(private readonly darkSwapClientCore: DarkSwapClientCore) {
    this.assetManager = darkSwapClientCore.getAssetManager();
  }

  @Get()
  async getWallets(): Promise<string[]> {
    return this.assetManager.getWallets();
  }

  @Post('/getBalance')
  @ApiGenericResponse(MyAssetsDto)
  async getAssetsByChainIdAndWallet(@Body() baseDto: BaseDto): Promise<MyAssetsDto> {
    return this.assetManager.getAssetsByChainIdAndWallet(baseDto);
  }


  @Post('syncAssets')
  async syncAssets(@Body() baseDto: BaseDto): Promise<void> {
    return this.assetManager.syncAssets(baseDto);
  }

  @Post('syncOneAsset')
  async syncOneAsset(@Body() syncAssetDto: SyncAssetDto): Promise<void> {
    return this.assetManager.syncOneAsset(syncAssetDto);
  }
}
