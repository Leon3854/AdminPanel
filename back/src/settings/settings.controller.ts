import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @Auth('ADMIN')
  @Get(':key')
  getSetting(@Param('key') key: string) {
    return this.settingService.getSettingByKey(key);
  }

  @Auth('ADMIN')
  @Post()
  setSetting(@Body() settingData: { key: string; value: string }) {
    return this.settingService.setSetting(settingData.key, settingData.value);
  }
}
