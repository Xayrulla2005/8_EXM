import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:".env"
    }),
    AuthModule,
  TypeOrmModule.forRoot({
    type:"postgres",
    username:process.env.DB_USERNAME,
    host:process.env.DB_HOST,
    port:5432,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    autoLoadEntities:true,
    synchronize:true
  }),
  ProductModule,
  CategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
