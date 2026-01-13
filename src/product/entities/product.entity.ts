import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { ProductFilterValue } from './product.filter.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  discountPrice: number;

  @Column({ default: false })
  isPopular: boolean;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @OneToMany(() => ProductFilterValue, fv => fv.product)
  filterValues: ProductFilterValue[];
}
