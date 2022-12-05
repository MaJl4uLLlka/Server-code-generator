import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { RedisService } from './services/redis.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { RepositoryModule } from './repository/repository.module';
import { EntityTemplateService } from './template-services/entity-template.service';
import { ServiceTemplateService } from './template-services/service-template.service';
import { ControllerTemplateService } from './template-services/controller-template.service';
import { TemplateInfoService } from './template-services/template-info.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    RepositoryModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    RedisService,
    EntityTemplateService,
    ServiceTemplateService,
    ControllerTemplateService,
    TemplateInfoService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.PUT });
  }
}
