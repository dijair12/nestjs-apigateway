import { Module } from "@nestjs/common";
import { CategoryModule } from "./category/category.module";
import { PlayerModule } from "./player/player.module";
import { ClientProxySmartRanking } from "./proxyrmq/client-proxy";
import { ProxyRMQModule } from "./proxyrmq/proxyrmq.module";
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [
    CategoryModule,
    PlayerModule,
    ProxyRMQModule,
    AwsModule,
    ConfigModule.forRoot({isGlobal: true}),
    ChallengeModule
  ],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
