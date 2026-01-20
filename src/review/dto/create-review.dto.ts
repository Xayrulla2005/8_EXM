import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 4.5 })
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ required: false })
  comment?: string;
}
