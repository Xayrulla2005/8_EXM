import { ApiProperty } from '@nestjs/swagger';
import { FilterType } from '../entities/categoriy.filter.entity';

export class CreateCategoryFilterDto {
  @ApiProperty({ example: 'brand' })
  name: string;

  @ApiProperty({ enum: FilterType, example: FilterType.STRING })
  type: FilterType;
}
