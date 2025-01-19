import { Controller, Get, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { MyAssetsDto } from './dto/asset.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Get('/:wallet')
  async getAssets(@Param('wallet') wallet: string): Promise<MyAssetsDto[]> {
    return this.accountService.getAssets(wallet);
  }
}