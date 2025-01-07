import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { AuthController } from '@/auth/auth.controller'
import { AuthModule } from '@/auth/auth.module'
import { EmailModule } from '@/email/email.module'
import { PaymentModule } from '@/modules/payment/payment.module'
import { UsersModule } from '@/modules/users/users.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    EmailModule,
    UsersModule,
    PaymentModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
