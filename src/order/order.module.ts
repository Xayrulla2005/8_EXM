import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order.item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart.item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem,Cart,CartItem,])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
