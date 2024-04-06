import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from '@src/app.module';

async function bootstrap() {
  const logger = new Logger();

  const nestApp = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  nestApp.use(helmet());
  nestApp.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Lemon FakeAPI')
    .setDescription('Case Backend - Elegibilidade para contratação')
    .setVersion('1.0.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(nestApp, swaggerConfig);
  SwaggerModule.setup('api', nestApp, swaggerDocument);

  const appPort = process.env.APP_PORT;
  await nestApp.listen(appPort, () => {
    logger.log(`🔥 Server running on port ${appPort}`);
  });
}
bootstrap();
