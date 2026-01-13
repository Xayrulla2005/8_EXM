export class CreateProductDto {
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  isPopular?: boolean;
  categoryId: number;

  filters: {
    filterId: number;
    value: string;
  }[];
}
