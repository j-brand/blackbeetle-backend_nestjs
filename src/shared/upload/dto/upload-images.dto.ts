import { IsString } from "class-validator";

export class UploadImagesDto {
  @IsString()
  path: string;

  @IsString()
  entity_id: string;

  files: Express.Multer.File[];
}
