import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  repo: any;
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async addReview(userId: number, productId: number, rating: number) {
    const review = this.reviewRepo.create({
      user: { id: userId } as any,
      product: { id: productId } as any,
      rating,
    });

    return this.reviewRepo.save(review);
  }

  async getStats(productId: number) {
  const reviews = await this.repo.find({
    where: { product: { id: productId } },
  });

  const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  for (const r of reviews) {
    const s = Math.floor(r.rating);
    stars[s]++;
    sum += r.rating;
  }

  return {
    totalReviews: reviews.length,
    average:
      reviews.length === 0
        ? 0
        : +(sum / reviews.length).toFixed(1),
    stars,
  };
}
}
