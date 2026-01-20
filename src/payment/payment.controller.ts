import {
  Controller,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Post(':orderId/pay')
  @ApiOperation({
    summary: 'Fake payment',
    description: 'Change order status to PAID',
  })
  @ApiParam({
    name: 'orderId',
    example: 12,
  })
  pay(@Param('orderId') orderId: number) {
    return this.paymentService.pay(+orderId);
  }
}
