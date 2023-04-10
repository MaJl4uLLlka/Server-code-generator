import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { RepositoryModule } from './repository/repository.module';
import { ServicesModule } from './services/services.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    RepositoryModule,
    ServicesModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.PUT },
        { path: 'users', method: RequestMethod.GET },
        { path: 'auth', method: RequestMethod.GET },
        { path: 'repositories', method: RequestMethod.POST },
        { path: 'repositories/user-repositories', method: RequestMethod.GET },
        { path: 'repositories/is-user-owner/:id', method: RequestMethod.GET },
        { path: 'repositories/:id', method: RequestMethod.GET },
        { path: 'repositories/:id', method: RequestMethod.PUT },
        { path: 'repositories/:id', method: RequestMethod.DELETE },
        { path: 'subscription', method: RequestMethod.POST },
        { path: 'subscription', method: RequestMethod.GET },
      );
  }
}
