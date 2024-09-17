import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDto } from '@media/dto/create-media.dto';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
