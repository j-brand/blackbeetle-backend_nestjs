import { Controller, Delete, Get, Param } from '@nestjs/common';
import { MediaService } from '@media/media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.mediaService.remove(+id);

    if (deleted) {
      return { message: 'Media deleted successfully' };
    }
  }
}
