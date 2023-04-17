import { Module } from '@nestjs/common';
import { EntityManagmentService } from './entity-managment.service';
import { EntityManagmentController } from './entity-managment.controller';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [EntityManagmentController],
  providers: [EntityManagmentService, PrismaService],
})
export class EntityManagmentModule {}
