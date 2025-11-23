import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { Express } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the Express app instance for static file handling
  const expressApp = app.getHttpAdapter().getInstance() as Express;

  // Handle Swagger static assets for production
  if (process.env.NODE_ENV === 'production') {
    // Redirect Swagger UI assets to CDN
    expressApp.get('/api/docs/swagger-ui.css', (req, res) => {
      res.redirect(
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      );
    });

    expressApp.get('/api/docs/swagger-ui-bundle.js', (req, res) => {
      res.redirect(
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      );
    });

    expressApp.get('/api/docs/swagger-ui-standalone-preset.js', (req, res) => {
      res.redirect(
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      );
    });
  }

  // Get CORS origins from environment variables
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173'];

  // Enable CORS for React frontend
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('User Registration System API')
    .setDescription(
      'A complete authentication system with user registration and login',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User registration and login endpoints')
    .addTag('Users', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Enhanced Swagger setup for production compatibility
  const swaggerOptions = {
    customSiteTitle: 'User Registration API',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  };

  SwaggerModule.setup('api/docs', app, document, swaggerOptions);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api/docs`,
  );
}

void bootstrap();
