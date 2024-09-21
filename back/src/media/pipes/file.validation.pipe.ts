import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/zip',
  'text/plain',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; //5mb для всех файлов кроме zip
const MAX_ZIP_FILE_SIZE = 100 * 1024 * 1024; // 100mb для zip файлов

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: any) {
    const files = Array.isArray(value) ? value : [value];

    for (const file of files) {
      if (!file || !file.mimetype) {
        throw new BadRequestException('Файл не представлен!');
      }

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Не поддерживаемый тип файла');
      }

      const maxSize =
        file.mimetype === 'application/zip' ? MAX_ZIP_FILE_SIZE : MAX_FILE_SIZE;

      if (file.size > maxSize) {
        throw new BadRequestException('Размер файла слишком большой');
      }
    }

    return value;
  }
}
