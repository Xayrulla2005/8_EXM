import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decarators/roles.decarator';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  ///// CREATE
  @Post()
  @ApiOperation({ summary: 'Create product (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  ///// FIND ALL
  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  @ApiQuery({ name: 'category', required: false, example: 'phone' })
  @ApiQuery({ name: 'brand', required: false, example: 'Apple' })
  @ApiQuery({ name: 'memory', required: false, example: '256GB' })
  @ApiQuery({ name: 'color', required: false, example: 'black' })
  @ApiQuery({ name: 'size', required: false, example: '42' })
  findAll(@Query() query: any) {
    return this.productService.findAllWithFilters(query);
  }

  ///// FIND ONE
  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  ///// UPDATE
  @Patch(':id')
  @ApiOperation({ summary: 'Update product (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  ///// DELETE
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
