import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
  })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
