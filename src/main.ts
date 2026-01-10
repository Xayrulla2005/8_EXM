import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ////SWAGGER
   const config = new DocumentBuilder()
    .setTitle('Exam Project API')
    .setDescription('API documentation for exam project')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document); 


  const PORT=process.env.PORT || 3000
  await app.listen(PORT,()=>{
    console.log("Server run at: ",PORT);
  });
}
bootstrap();
