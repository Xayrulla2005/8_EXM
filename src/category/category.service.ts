import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CategoryFilter } from './entities/categoriy.filter.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(CategoryFilter)
    private readonly filterRepo: Repository<CategoryFilter>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepo.create({
      name: dto.name,
      slug: dto.slug,
    });

    await this.categoryRepo.save(category);

    const filters = dto.filters.map(f =>
      this.filterRepo.create({
        name: f.name,
        type: f.type,
        category,
      }),
    );

    await this.filterRepo.save(filters);

    return this.findOne(category.id);
  }

  findAll() {
    return this.categoryRepo.find({
      relations: ['filters'],
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['filters'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  remove(id: number) {
    return this.categoryRepo.delete(id);
  }
}
