import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import 'dotenv/config';

const prisma = new PrismaClient();

const countries = [
  'Russia',
  'South Korea',
  'Thailand',
  'China',
  'Uzbekistan',
  'Turkmenistan',
  'Armenia',
];

async function main() {
  const NUM_USERS = 200;

  for (let i = 0; i < NUM_USERS; i++) {
    const email = faker.internet.email();
    const name = faker.person.firstName();
    const avatarUrl = faker.image.avatar();
    const password = await hash('123456');
    const country = faker.helpers.arrayElement(countries);
    const createdAt = faker.date.past({ years: 1 });

    const updatedAt = new Date(
      createdAt.getTime() +
        Math.random() * (new Date().getTime() - createdAt.getTime()),
    );

    await prisma.user.create({
      data: {
        email,
        name,
        avatarUrl,
        country,
        password,
        createdAt,
        updatedAt,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// .catch((e) => { ... }): Этот блок обрабатывает любые ошибки,
// которые могут возникнуть во время выполнения функции main().
// Если ошибка происходит, она выводится в консоль, и процесс
// завершается с кодом выхода 1 (process.exit(1)), что указывает на
// ошибку.

// .finally(async () => { ... }): Этот блок выполняется независимо
// от того, произошла ли ошибка или нет. Он гарантирует, что
// соединение с базой данных будет закрыто вызовом
// await prisma.$disconnect(). Это важно для освобождения
// ресурсов и предотвращения утечек памяти.
