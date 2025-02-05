import { BaseDto } from "../../common/dto/base.dto";


export class TakerConfirmDto extends BaseDto {
    orderId: string;
    swapMessage: string;
}