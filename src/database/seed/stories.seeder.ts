import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { CreateStoryDto } from '@stories/dto/create-story.dto';
import { StoriesService } from '@stories/stories.service';

export class StoriesSeeder {
  constructor(private readonly storiesService: StoriesService) {}

  async seed(count: number) {
    const stories = Array.from({ length: count }, async () => {
      const storyData = this.getStory();
      return await this.storiesService.create(storyData);
    });
    Logger.log(`${count} stories created`, 'Stories Seeder');

    return Promise.all(stories);
  }

  private getStory(): CreateStoryDto {
    const story: CreateStoryDto = {
      title: faker.lorem.words(3),
      slug: faker.lorem.slug(),
      active: faker.datatype.boolean(),
      description: faker.lorem.words(10),
    };
    return story;
  }
}
