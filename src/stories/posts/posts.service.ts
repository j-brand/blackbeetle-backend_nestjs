import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '@entities/post.entity';
import { CreatePostDto } from '@posts/dto/create-post.dto';
import { UpdatePostDto } from '@posts/dto/update-post.dto';
import { MediaService } from '@media/media.service';
import { CreateMediaDto } from '@media/dto/create-media.dto';
import { PostMedia } from '@entities/post_media.entity';
import { StoriesService } from '@stories/stories.service';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PageMetaDtoFactory } from '@shared/pagination/page-meta.dto';
import { PublicPostDto } from './dto/public-post.dto';
import { PostDto } from './dto/post.dto';
import { PageDto } from '@shared/pagination/page.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private repo: Repository<Post>,
    @InjectRepository(PostMedia) private postMediaRepo: Repository<PostMedia>,
    private readonly mediaService: MediaService,
    private readonly storyService: StoriesService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.repo.create(createPostDto);
    const story = await this.storyService.findOne(createPostDto.story_id);
    post.story = story;
    createPostDto.order = story.posts.length + 1;
    return this.repo.save(post);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PublicPostDto | PostDto>> {
    const [items, itemCount] = await this.repo.findAndCount({
      order: { order: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: ['author', 'story'],
    });

    const pageMetaDto = PageMetaDtoFactory.create({
      pageOptionsDto,
      itemCount,
    });

    return new PageDto(items, pageMetaDto);
  }

  async findByStory(
    storyId: number,
    pageOptionsDto: PageOptionsDto,
    active_only: boolean = false,
  ): Promise<PageDto<PublicPostDto | PostDto>> {
    const [items, itemCount] = await this.repo.findAndCount({
      where: active_only
        ? { story: { id: storyId, active: true } }
        : { story: { id: storyId } },
      order: { order: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: ['author', 'story'],
    });

    if (!items.length) {
      throw new NotFoundException('No stories found');
    }

    const pageMetaDto = PageMetaDtoFactory.create({
      pageOptionsDto,
      itemCount,
    });

    return new PageDto(items, pageMetaDto);
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.repo.findOne({
      where: { id },
      relations: ['media', 'comments'],
    });
    this.ensurePostExists(post, id);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.repo.findOne({ where: { id } });
    this.ensurePostExists(post, id);
    Object.assign(post, updatePostDto);
    return this.repo.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.repo.findOne({ where: { id } });
    this.ensurePostExists(post, id);
    await this.repo.remove(post);
  }

  async addImage(id: number, image: Express.Multer.File): Promise<PostMedia[]> {
    let post = await this.repo.findOne({
      where: { id },
      relations: ['story', 'media'],
    });

    this.ensurePostExists(post, id);

    const newMedia = await this.mediaService.create(
      {
        title: image.filename,
        upload_path: `storage/upload/tmp`,
        path: `storage/stories/${post.story.id}/posts/${id}`,
        type: 'IMAGE',
      } as CreateMediaDto,
      ['webp', 'large', 'thumbnail'],
    );

    const postImage = new PostMedia();
    postImage.media = newMedia;
    postImage.post = post;
    postImage.order = post.media.length + 1;
    post.media.push(postImage);

    const save = await this.repo.save(post);

    // console.log(save);

    return save.media;
  }

  async removeImage(postId: number, mediaId: number): Promise<Post> {
    let post = await this.repo.findOne({
      where: { id: postId },
      relations: ['media'],
    });
    this.ensurePostExists(post, postId);

    const media = post.media.find((m) => m.media.id === mediaId);
    if (!media) {
      throw new NotFoundException(`Media with ID ${mediaId} not found`);
    }

    post.media = post.media.filter((m) => m.media.id !== mediaId);
    await this.mediaService.remove(media.media.id);

    return await this.repo.save(post);
  }

  async updateImageOrder(
    postId: number,
    imageId1: number,
    imageId2: number,
  ): Promise<Post> {
    const post = await this.repo.findOne({
      where: { id: postId },
      relations: ['media'],
    });

    this.ensurePostExists(post, postId);

    const image1 = post.media.find((i) => i.id === imageId1);
    const image2 = post.media.find((i) => i.id === imageId2);

    if (!image1 || !image2) {
      throw new NotFoundException(
        `Image with ID ${image1 ? imageId2 : imageId1} not found`,
      );
    }

    const tmpOrder = image1.order;
    image1.order = image2.order;
    image2.order = tmpOrder;

    return await this.repo.save(post);
  }

  private ensurePostExists(post: Post | undefined, id: number): void {
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}
