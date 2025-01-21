import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsOrderDirectionValid } from '../../common/decorators/is-order-direction-valid.decorator';
import { IsOrderStpModeValid } from '../../common/decorators/is-order-stp-mode-valid.decorator';
import { IsOrderTimeInForceValid } from '../../common/decorators/is-order-time-in-force-valid.decorator';
import { IsOrderTypeValid } from '../../common/decorators/is-order-type-valid.decorator';
import { BaseDto } from '../../common/dto/base.dto';
import { OrderDirection, OrderStatus } from '../../types';

export class OrderDto extends BaseDto {
    id?: number;
    @ApiProperty()
    @IsNotEmpty()
    orderId: string;
    @ApiProperty()
    @IsNotEmpty()
    assetPairId: string;
    @ApiProperty({
        enum: OrderDirection,
        description: '0 for buy, 1 for sell',
    })
    @IsOrderDirectionValid()
    orderDirection: OrderDirection;
    @ApiProperty()
    @IsOrderTypeValid()
    orderType: number;
    @ApiProperty()
    @IsOrderTimeInForceValid()
    timeInForce: number;
    @ApiProperty()
    @IsOrderStpModeValid()
    stpMode: number;
    @ApiProperty({description: 'Human readable price'})
    @IsNotEmpty()
    price: string;
    @ApiProperty({description: 'Amount with decimals'})
    @IsNotEmpty()
    amountOut: string;
    @ApiProperty({description: 'Amount with decimals'})
    @IsNotEmpty()
    amountIn: string;
    @ApiProperty({description: 'Amount with decimals'})
    @IsOptional()
    partialAmountIn?: string;
    @ApiProperty()
    @IsOptional()
    status?: OrderStatus;
    publicKey?: string;
    noteCommitment?: string;
    incomingNoteCommitment?: string;
    nullifier?: string;
    txHashCreated?: string;
    txHashSettled?: string;
} 