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
import { ServiceModuleModule } from './template-services/service-module.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    RepositoryModule,
    ServiceModuleModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'users', method: RequestMethod.PUT },
      { path: 'auth', method: RequestMethod.GET },
      { path: 'repositories', method: RequestMethod.POST },
      { path: 'repositories/user-repositories', method: RequestMethod.GET },
      {
        path: 'repositories/user-repositories/count',
        method: RequestMethod.GET,
      },
    );
  }
}
