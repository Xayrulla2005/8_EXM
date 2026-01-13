import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductFilterValue } from './entities/product.filter.entity';
import { Category } from '../category/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductFilterValue)
    private readonly filterValueRepo: Repository<ProductFilterValue>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  ///// CREATE (CATEGORY FILTER VALIDATION BILAN)
  async create(createProductDto: CreateProductDto) {
    const { categoryId, filters, ...productData } = createProductDto;

    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
      relations: ['filters'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productRepo.create({
      ...productData,
      category,
    });

    await this.productRepo.save(product);

    if (filters && filters.length > 0) {
      const allowedFilterIds = category.filters.map(f => f.id);

      const filterValues = filters.map(fv => {
        if (!allowedFilterIds.includes(fv.filterId)) {
          throw new BadRequestException(
            `Filter ${fv.filterId} is not allowed for this category`,
          );
        }

        return this.filterValueRepo.create({
          value: fv.value,
          product,
          filter: { id: fv.filterId } as any,
        });
      });

      await this.filterValueRepo.save(filterValues);
    }

    return this.findOne(product.id);
  }

  ///// FIND ALL WITH FILTERS (CATEGORY + FILTER QUERY)
  async findAllWithFilters(query: any) {
    const { category, ...filters } = query;

    const categoryEntity = await this.categoryRepo.findOne({
      where: { slug: category },
      relations: ['filters'],
    });

    if (!categoryEntity) {
      throw new NotFoundException('Category not found');
    }

    const allowedFilters = categoryEntity.filters.map(f => f.name);

    const filterEntries = Object.entries(filters).filter(
      ([key]) => allowedFilters.includes(key),
    );

    let qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.filterValues', 'pfv')
      .leftJoin('pfv.filter', 'filter')
      .where('category.id = :categoryId', {
        categoryId: categoryEntity.id,
      });

    filterEntries.forEach(([key, value], index) => {
      qb = qb.andWhere(
        `(filter.name = :filterName${index} AND pfv.value = :filterValue${index})`,
        {
          [`filterName${index}`]: key,
          [`filterValue${index}`]: value,
        },
      );
    });

    qb = qb.groupBy('product.id');

    return qb.getMany();
  }

  ///// FIND ONE
  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'category',
        'filterValues',
        'filterValues.filter',
      ],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  ///// UPDATE
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepo.update(id, updateProductDto);
    return this.findOne(id);
  }

  ///// DELETE
  async remove(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepo.delete(id);

    return { message: 'Product deleted successfully' };
  }
}
