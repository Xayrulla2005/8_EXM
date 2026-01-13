import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

export enum FilterType {
  STRING = 'string',
  NUMBER = 'number',
}

@Entity()
export class CategoryFilter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // brand, memory, size, color

  @Column({
    type: 'enum',
    enum: FilterType,
    default: FilterType.STRING,
  })
  type: FilterType;

  @ManyToOne(() => Category, category => category.filters, {
    onDelete: 'CASCADE',
  })
  category: Category;
}
