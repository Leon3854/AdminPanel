import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SettingsModule } from './settings/settings.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    EmailModule,
    StatisticsModule,
    SettingsModule,
    MediaModule,
  ],
})
export class AppModule {}
