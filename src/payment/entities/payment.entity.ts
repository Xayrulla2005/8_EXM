import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @ManyToOne(() => Order, order => order.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order; // ✅ ARRAY EMAS

  @Column({ type: 'varchar' })
  method: string;

  @Column('decimal')
  amount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'failed';

  @CreateDateColumn()
  createdAt: Date;
}
