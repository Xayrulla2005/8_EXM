import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order.item.entity';

import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart.item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,

    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
  ) {}

  async checkout(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let total = 0;

    const items = cart.items.map(i => {
      total += i.price * i.quantity;

      return this.itemRepo.create({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.price,
      });
    });

    const order = this.orderRepo.create({
      userId,
      totalPrice: total,
      items,
      status: OrderStatus.PENDING,
    });

    const saved = await this.orderRepo.save(order);

    await this.cartItemRepo.delete({
      cart: { id: cart.id },
    });

    return saved;
  }

  myOrders(userId: number) {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items'],
      order: { id: 'DESC' },
    });
  }
}
