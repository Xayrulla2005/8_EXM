import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { ProductAttribute } from './entities/product-atribute.entity';
import { ProductFilterValue } from './entities/product.filter.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductFilterValue,
      Category,  
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService], 
})
export class ProductModule {}
