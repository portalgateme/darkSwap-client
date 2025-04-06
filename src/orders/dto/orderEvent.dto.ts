import { BaseDto } from "../../common/dto/base.dto";

export class OrderEventDto extends BaseDto {
  id: number;
  orderId: string;
  status: number;
  createdAt: Date;
} 