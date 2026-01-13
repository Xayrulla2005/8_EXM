import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CategoryFilter } from './categoriy.filter.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Phone

  @Column({ unique: true })
  slug: string; // phone

  @OneToMany(() => CategoryFilter, filter => filter.category)
  filters: CategoryFilter[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
