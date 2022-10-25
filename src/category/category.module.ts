import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoryController } from './category.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoryController],
  providers: [],
})
export class CategoryModule {}
