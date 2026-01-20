import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({
    summary: 'Get my cart',
    description: 'Authorized user cart with items',
  })
  getMyCart(@Req() req) {
    return this.cartService.getUserCart(req.user.id);
  }

  @Post('add')
  @ApiOperation({
    summary: 'Add product to cart',
  })
  @ApiBody({ type: AddToCartDto })
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Patch('item/:id')
  @ApiOperation({
    summary: 'Update cart item quantity',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({ type: UpdateCartDto })
  updateQuantity(
    @Param('id') id: number,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateQuantity(id, dto.quantity);
  }

  @Delete('item/:id')
  @ApiOperation({
    summary: 'Remove item from cart',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  remove(@Param('id') id: number) {
    return this.cartService.removeItem(id);
  }
}
