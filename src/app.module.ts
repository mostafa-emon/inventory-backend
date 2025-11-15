import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from './modules/company/company.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule
      ],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_CONNECTION_STRING"),
      }),
      inject: [
        ConfigService
      ],
    }),
    CompanyModule,
    CategoryModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
