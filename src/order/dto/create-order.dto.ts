import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}

export class CreateOrderDto {
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}
