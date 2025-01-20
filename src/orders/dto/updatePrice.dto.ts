import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from '../../common/dto/base.dto';

export class UpdatePriceDto extends BaseDto {
    @ApiProperty()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty()
    @IsNotEmpty()
    price: string;

    @ApiProperty()
    @IsNotEmpty()
    amountIn: string;
    
    @ApiProperty()
    @IsNotEmpty()
    partialAmountIn: string;
} 