import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from '../prisma.service';
import { count } from 'console';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getUserRegistrationsByMonth() {
    // текущий месяц (от 0 до 11)
    const currentMonth = new Date().getMonth();
    // текущий год
    const currentYear = new Date().getFullYear();
    // начало отчетного периода: июль прошлого года
    const startDate = new Date(currentYear - 1, currentMonth + 1, 1);
    // конец отчетного периода: последний день текущего месяца
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    // генерация всех месяцев startDate & endDate
    const allMonths = this.generateMonths(startDate, endDate);
    // группировка пользователей по месяцу создания (createdAt)
    const registrations = await this.prisma.user.groupBy({
      by: ['createdAt'],
      _count: true,
      orderBy: {
        // сортировка по дате создания в порядке возростания
        createdAt: 'asc',
      },
      where: {
        createdAt: {
          // От начала отчетного периода
          gte: startDate,
          // до конца отчетного преиода
          lte: endDate,
        },
      },
    });

    // Мар для хранения количества
    const registrationMap = new Map<string, number>();

    for (const reg of registrations) {
      // получаем месяц создания от 1 до 12
      const month = reg.createdAt.getMonth() + 1;
      // получаем год создания
      const year = reg.createdAt.getFullYear();
      // создаем ключ в формате "год-месяц"
      const key = `${year}-${month}`;

      if (registrationMap.has(key)) {
        // если ключ уже существует, увеличиваем значение на количество регистраций
        registrationMap.set(key, registrationMap.get(key) + reg._count);
      } else {
        // если ключ не существует, добавляем новую запись
        registrationMap.set(key, reg._count);
      }
    }

    // преобразование списка месяцев в формат с названиями
    // месяцев и подсчетом регистрации
    return allMonths.map(({ month, year }) => {
      // ключ в формате "год-месяц"
      const key = `${year} - ${month}`;
      // преобразование числа месяца в название
      const monthName = dayjs(new Date(year, month - 1)).format('MMMM');
      return {
        // название месяца
        month: monthName,
        year,
        // количество регистраций или 0, если нет регистраций
        count: registrationMap.get(key) || 0,
      };
    });
  }

  private generateMonths(
    start: Date,
    end: Date,
  ): { month: number; year: number }[] {
    const current = new Date(start);
    const endMonth = new Date(end);
    const months = [];

    while (current < endMonth) {
      months.push({
        month: current.getMonth() + 1,
        year: current.getFullYear(),
      });
      current.setMonth(current.getMonth() + 1);
    }
    // добавление последнего месяца

    months.push({
      months: endMonth.getMonth() + 1,
      year: endMonth.getFullYear(),
    });
    // возвращаем массив месяцев
    return months;
  }

  async getNumbers() {
    const usersCount = await this.prisma.user.count();

    const activeUsersCount = await this.prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    const newUsersLastMonth = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    const uniqueCountriesCount = await this.prisma.user.groupBy({
      by: ['country'],
      _count: {
        country: true,
      },
      where: {
        country: {
          not: null,
        },
      },
    });

    return [
      {
        name: 'Users',
        value: usersCount,
      },
      {
        name: 'Active Users',
        value: activeUsersCount,
      },
      {
        name: 'Last Month',
        value: newUsersLastMonth,
      },
      {
        name: 'Countries',
        value: uniqueCountriesCount.length,
      },
    ];
  }

  async getUsersCountByCountry() {
    const result = await this.prisma.user.groupBy({
      by: ['country'],
      _count: {
        country: true,
      },
      where: {
        country: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
    });

    return result.map((item) => ({
      country: item.country,
      count: item._count.country,
    }));
  }
}
