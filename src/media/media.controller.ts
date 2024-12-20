import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { MediaService } from '@media/media.service';
import * as fs from 'fs';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const media = await this.mediaService.remove(+id);
    if (!media) {
      throw new NotFoundException();
    }
    fs.unlinkSync(media.path);
    if (media.variations) {
      media.variations.forEach((variation) => {
        fs.unlinkSync(variation.path);
      });
    }
  }
}
