import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order,OrderStatus } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from 'src/order/entities/order.item.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async dashboard() {
    const totalOrders = await this.orderRepo.count();

    const paidOrders = await this.orderRepo.count({
      where: { status: OrderStatus.PAID }
    });

    const cancelledOrders = await this.orderRepo.count({
      where: { status: OrderStatus.CANCELLED }
    });

    const revenueRaw = await this.orderRepo
      .createQueryBuilder('o')
      .select('SUM(o.totalPrice)', 'sum')
      .where('o.status = :status', { status: 'paid' })
      .getRawOne();

    const revenue = Number(revenueRaw.sum) || 0;

    const customersRaw = await this.orderRepo
      .createQueryBuilder('o')
      .select('COUNT(DISTINCT o.userId)', 'count')
      .getRawOne();

    const customers = Number(customersRaw.count) || 0;

    const products = await this.productRepo.count();

    const topProducts = await this.itemRepo
      .createQueryBuilder('item')
      .select('item.productId', 'productId')
      .addSelect('SUM(item.quantity)', 'sold')
      .groupBy('item.productId')
      .orderBy('sold', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      orders: {
        total: totalOrders,
        paid: paidOrders,
        cancelled: cancelledOrders,
      },
      revenue,
      customers,
      products,
      topProducts,
    };
  }
}
