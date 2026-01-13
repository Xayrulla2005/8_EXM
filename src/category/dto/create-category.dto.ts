import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryFilterDto } from './create.categoriy.filter.dto';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Phone' })
  name: string;

  @ApiProperty({ example: 'phone' })
  slug: string;

  @ApiProperty({
    example: [
      { name: 'brand', type: 'string' },
      { name: 'memory', type: 'string' },
      { name: 'color', type: 'string' },
    ],
  })
  filters: CreateCategoryFilterDto[];
}
