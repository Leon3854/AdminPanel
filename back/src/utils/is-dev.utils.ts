import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();
export const isDev = (configService: ConfigService): boolean => {
  return configService.get('NODE_ENV') === 'development';
};

export const IS_DEV_ENV = process.env.MODE_ENV === 'development';
