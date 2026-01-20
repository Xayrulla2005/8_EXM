import { ShippingMethod } from '../../order/entities/shipping.method.enum';

export class CheckoutDto {
  addressId: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethodData;
}

