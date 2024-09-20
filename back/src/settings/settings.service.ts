import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Setting } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettingByKey(key: string): Promise<Setting | null> {
    return this.prisma.setting.findUnique({
      where: { key },
    });
  }

  async setSetting(key: string, value: string): Promise<Setting> {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
