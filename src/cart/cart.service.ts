import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { Product } from '../product/entities/product.entity';
import { AddToCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private itemRepo: Repository<CartItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async getUserCart(userId: number) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepo.create({
        user: { id: userId } as any,
      });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.getUserCart(userId);

    let item = await this.itemRepo.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: product.id },
      },
    });

    if (item) {
      item.quantity += dto.quantity;
    } else {
      item = this.itemRepo.create({
        cart,
        product,
        quantity: dto.quantity,
        price: product.price,
      });
    }

    return this.itemRepo.save(item);
  }

  async updateQuantity(itemId: number, quantity: number) {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
    });

    if (!item) throw new NotFoundException('Item not found');

    item.quantity = quantity;
    return this.itemRepo.save(item);
  }

  async removeItem(itemId: number) {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
    });

    if (!item) throw new NotFoundException('Item not found');

    await this.itemRepo.remove(item);
    return { message: 'Item removed' };
  }
}
