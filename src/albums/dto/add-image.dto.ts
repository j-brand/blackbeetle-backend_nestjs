import { IsString } from 'class-validator';

export class AddImagesDto {

  files: Express.Multer.File[];
}
