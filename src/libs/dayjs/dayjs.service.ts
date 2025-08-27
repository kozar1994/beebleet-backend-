import { Injectable } from '@nestjs/common';
import dayjs from './dayjs.setup';
import type { ConfigType, Dayjs } from 'dayjs';

@Injectable()
export class DayjsService {
  now(): Dayjs {
    return dayjs();
  }

  parse(date: ConfigType, format?: string): Dayjs {
    return dayjs(date, format);
  }

  utc(date?: ConfigType): Dayjs {
    return dayjs.utc(date);
  }

  isoString(date?: ConfigType): string {
    return this.utc(date).toISOString();
  }
}
