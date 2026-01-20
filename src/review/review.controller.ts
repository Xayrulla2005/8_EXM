import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private service: ReviewService) {}

  @Post(':productId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  rate(
    @Req() req,
    @Param('productId') id: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.service.addReview(
      req.user.id,
      +id,
      dto.rating,
    );
  }

  @Get(':productId/stats')
  stats(@Param('productId') id: number) {
    return this.service.getStats(+id);
  }
}

