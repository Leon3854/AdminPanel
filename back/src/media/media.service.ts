import { Injectable } from '@nestjs/common';
import { IFile, IMediaResponse } from './media.interface';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { cleanFileName } from './clean-name';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  async saveMedia(
    mediaFiles: IFile | IFile[],
    folder = 'default',
  ): Promise<IMediaResponse[]> {
    const folderLowerCase = folder.toLowerCase();

    const uploadFolder = `${path}/uploads/${folderLowerCase}`;
    await ensureDir(uploadFolder);

    const response: IMediaResponse[] = [];

    for (const file of Array.isArray(mediaFiles) ? mediaFiles : [mediaFiles]) {
      let fileName = file?.originalname || file?.name;
      fileName = cleanFileName(fileName);

      const uniqueSuffix = uuidv4().split('-')[0];
      const uniqueFileName = `${uniqueSuffix} - ${fileName}`;

      await writeFile(`${uploadFolder}/${uniqueFileName}`, file.buffer);

      response.push({
        url: `/uploads/${folderLowerCase}/${uniqueFileName}`,
        name: uniqueFileName,
      });
    }

    return response;
  }
}
