import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { CategoryFilter } from '../../category/entities/categoriy.filter.entity';

@Entity()
export class ProductFilterValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string; // Apple, 256GB, 42

  @ManyToOne(() => Product, product => product.filterValues, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => CategoryFilter, {
    eager: true,
  })
  filter: CategoryFilter;
}
