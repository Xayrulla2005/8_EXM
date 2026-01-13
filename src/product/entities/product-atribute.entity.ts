import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string; 

  @Column()
  value: string;

  @ManyToOne(() => Product, product => product.id, { onDelete: 'CASCADE' })
  product: Product;
}
