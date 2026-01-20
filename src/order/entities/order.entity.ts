import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { OrderItem } from './order.item.entity';
import { ShippingMethod } from './shipping.method.enum';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔥 SHART
  @Column()
  userId: number;

  // 🔥 SHART
  @Column({ type: 'jsonb' })
  addressJson: any;

  @Column({
    type: 'enum',
    enum: ShippingMethod,
    default: ShippingMethod.FREE,
  })
  shippingMethod: ShippingMethod;

  @Column({ type: 'decimal' })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @OneToMany(() => OrderItem, item => item.order, {
    cascade: true,
  })
  items: OrderItem[];
  payments: any;

  
}
