import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from '../../common/dto/base.dto';

export class UpdatePriceDto extends BaseDto {
    @ApiProperty()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({description: 'Human readable price'})
    @IsNotEmpty()
    price: string;

    @ApiProperty({description: 'Amount with decimals'})
    @IsNotEmpty()
    amountIn: string;
    
    @ApiProperty({description: 'Amount with decimals'})
    @IsNotEmpty()
    partialAmountIn: string;
} 