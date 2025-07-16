import { loadSwagger } from '@gitroom/helpers/swagger/load.swagger';

process.env.TZ = 'UTC';

import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SubscriptionExceptionFilter } from '@gitroom/backend/services/auth/permissions/subscription.exception';
import { HttpExceptionFilter } from '@gitroom/nestjs-libraries/services/exception.filter';
import { ConfigurationChecker } from '@gitroom/helpers/configuration/configuration.checker';

// Collect environment variables at the top for clarity
const ENV = {
  PORT: process.env.PORT || '3000',
  FRONTEND_URL: process.env.FRONTEND_URL,
  MAIN_URL: process.env.MAIN_URL,
  NOT_SECURED: process.env.NOT_SECURED,
};

function getAllowedOrigins() {
  // Only include non-empty, unique origins
  const origins = [ENV.FRONTEND_URL, ENV.MAIN_URL].filter(Boolean);
  return Array.from(new Set(origins));
}

function setupCors() {
  const allowedOrigins = getAllowedOrigins();
  Logger.log(`Allowed CORS Origins: ${allowedOrigins.join(', ')}`);
  return {
    origin: function (origin: string, callback: (err: Error | null, allow?: boolean) => void) {
      Logger.debug(`CORS request from origin: ${origin}`);
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        Logger.warn(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    exposedHeaders: [
      'reload', 'onboarding', 'activate',
      ...(ENV.NOT_SECURED ? ['auth', 'showorg', 'impersonate'] : []),
    ],
  };
}

async function bootstrap() {
  const corsOptions = setupCors();
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: corsOptions,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.use(cookieParser());
  app.useGlobalFilters(new SubscriptionExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  loadSwagger(app);

  const port = ENV.PORT;
  const host = '0.0.0.0'; // Railway ve production için dışarıya aç

  try {
    await app.listen(port, host);
    checkConfiguration();
    Logger.log(`🚀 Backend is running on: http://localhost:${port}`);
  } catch (e) {
    Logger.error(`Backend failed to start on port ${port}`, e);
  }
}

function checkConfiguration() {
  const checker = new ConfigurationChecker();
  checker.readEnvFromProcess();
  checker.check();

  if (checker.hasIssues()) {
    for (const issue of checker.getIssues()) {
      Logger.warn(issue, 'Configuration issue');
    }
    Logger.warn('Configuration issues found: ' + checker.getIssuesCount());
  } else {
    Logger.log('Configuration check completed without any issues.');
  }
}

bootstrap();
