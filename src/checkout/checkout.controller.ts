// checkout.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from 'src/order/dto/checkout.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard'; 

@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async checkout(@Req() req, @Body() dto: CheckoutDto) {
    const userId = req.user.id;
    return this.checkoutService.checkout(userId, dto);
  }
}