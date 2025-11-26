import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from './modules/company/company.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { TestsModule } from './tests/tests.module';

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
    CategoryModule,
    UserModule,
    TestsModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
