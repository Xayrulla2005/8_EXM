import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "src/adress/entities/adress.entity";
import { Cart } from "src/cart/entities/cart.entity";
import { CheckoutDto } from "src/order/dto/checkout.dto";
import { Order, OrderStatus } from "src/order/entities/order.entity";
import { OrderItem } from "src/order/entities/order.item.entity";
import { Payment } from "src/payment/entities/payment.entity";
import { Repository } from "typeorm";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";

@Injectable()
export class CheckoutService {
  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  create(createCheckoutDto: CreateCheckoutDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,

    @InjectRepository(Address)
    private addressRepo: Repository<Address>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async checkout(userId: number, dto: CheckoutDto) {
  const cart = await this.cartRepo.findOne({
    where: { user: { id: userId } },
    relations: ['items', 'items.product'],
  });

  if (!cart || cart.items.length === 0) {
    throw new BadRequestException('Cart empty');
  }

  const address = await this.addressRepo.findOne({
    where: { id: dto.addressId, userId },
  });

  if (!address) {
    throw new BadRequestException('Address not found');
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
    status: OrderStatus.PENDING,
    shippingMethod: dto.shippingMethod,
    addressJson: {
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      street: address.street,
    },
    items,
  });

  const savedOrder = await this.orderRepo.save(order);

  await this.paymentRepo.save({
  orderId: order.id,
  method: 'credit_card', 
  amount: 100.50,
  status: 'pending',
});

  await this.cartRepo.delete(cart.id);

  return savedOrder;
}

}
