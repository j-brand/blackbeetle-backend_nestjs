import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '@entities/post.entity';
import { PostMedia } from '@entities/post_media.entity';
import { OrderedBulkOperation, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MediaService } from '@media/media.service';
import { StoriesService } from '@stories/stories.service';
import { User } from '@entities/user.entity';
import { Media } from '@entities/media.entity';
import { Story } from '@entities/story.entity';

describe('PostsService', () => {
  let service: PostsService;
  let repo: Repository<Post>;
  let postMediaRepo: Repository<PostMedia>;
  let mediaService: MediaService;
  let storiesService: StoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PostMedia),
          useClass: Repository,
        },
        {
          provide: MediaService,
          useValue: {
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: StoriesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<Repository<Post>>(getRepositoryToken(Post));
    postMediaRepo = module.get<Repository<PostMedia>>(getRepositoryToken(PostMedia));
    mediaService = module.get<MediaService>(MediaService);
    storiesService = module.get<StoriesService>(StoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: Partial<CreatePostDto> = {
        title: 'New Post',
        content: 'Content',
        story_id: 1,
        author: {} as User,
      };
      const story = { id: 1, posts: [] } as any;
      const post = { id: 1, ...createPostDto } as Post;

      jest.spyOn(storiesService, 'findOne').mockResolvedValue(story);
      jest.spyOn(repo, 'create').mockReturnValue(post);
      jest.spyOn(repo, 'save').mockResolvedValue(post);

      expect(await service.create(createPostDto as CreatePostDto)).toBe(post);
      expect(storiesService.findOne).toHaveBeenCalledWith(createPostDto.story_id);
      expect(repo.create).toHaveBeenCalledWith(createPostDto);
      expect(repo.save).toHaveBeenCalledWith(post);
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      const post = { id: 1, title: 'Post 1' } as Post;
      jest.spyOn(repo, 'findOne').mockResolvedValue(post);

      expect(await service.findOne(1)).toBe(post);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['media', 'comments'],
      });
    });

    it('should throw NotFoundException if post is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: Partial<UpdatePostDto> = { content: 'Updated Content' };
      const post = { id: 1, title: 'Post 1', content: 'Old Content' } as Post;
      const updatedPost = { ...post, ...updatePostDto };

      jest.spyOn(repo, 'findOne').mockResolvedValue(post);
      jest.spyOn(repo, 'save').mockResolvedValue(updatedPost);

      expect(await service.update(1, updatePostDto as UpdatePostDto)).toBe(updatedPost);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.save).toHaveBeenCalledWith(updatedPost);
    });

    it('should throw NotFoundException if post is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {} as UpdatePostDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const post = { id: 1, title: 'Post 1' } as Post;

      jest.spyOn(repo, 'findOne').mockResolvedValue(post);
      jest.spyOn(repo, 'remove').mockResolvedValue(post);

      expect(await service.remove(1)).toBeUndefined();
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.remove).toHaveBeenCalledWith(post);
    });

    it('should throw NotFoundException if post is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
  describe('addImage', () => {
    it('should throw NotFoundException if post is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      const file = { filename: 'image.jpg' } as Express.Multer.File;

      await expect(service.addImage(1, file)).rejects.toThrow(NotFoundException);
    });

    it('should add an image to a post', async () => {
      const file = { filename: 'image.jpg' } as Express.Multer.File;
      const post = { id: 1, title: 'Post 1', media: [], story: { id: 1 } } as Post;
      const newMedia = { id: 1, title: 'image.jpg' } as any;
      const postMedia = { id: 1, media: newMedia, order: 1 } as PostMedia;
      const updatedPost = { ...post, media: [postMedia] };

      jest.spyOn(repo, 'findOne').mockResolvedValue(post);
      jest.spyOn(mediaService, 'create').mockResolvedValue(newMedia);
      jest.spyOn(repo, 'save').mockResolvedValue(updatedPost);

      expect(await service.addImage(1, file)).toEqual([postMedia]);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['story', 'media'] });
      expect(mediaService.create).toHaveBeenCalledWith(
        {
          title: file.filename,
          upload_path: `storage/upload/tmp`,
          path: `storage/stories/${post.story.id}/posts/${post.id}`,
          type: 'IMAGE',
        },
        ['webp', 'large', 'thumbnail'],
      );
      //expect(repo.save).toHaveBeenCalledWith(updatedPost);
    });



    it('should throw NotFoundException if post is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.removeImage(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if media is not found', async () => {
      const post = { id: 1, title: 'Post 1', media: [] } as Post;

      jest.spyOn(repo, 'findOne').mockResolvedValue(post);

      await expect(service.removeImage(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateImageOrder', () => {
    it('should update the order of images in a post', async () => {
      const image1 = { id: 1, order: 1 } as PostMedia;
      const image2 = { id: 2, order: 2 } as PostMedia;
      const post = { id: 1, title: 'Post 1', media: [image1, image2] } as Post;
      const updatedPost = { ...post, media: [{id:1, order:2}, {id:2, order:1}] as PostMedia[] };


      jest.spyOn(repo, 'findOne').mockResolvedValue(post);
      jest.spyOn(repo, 'save').mockResolvedValue(updatedPost);

      expect(await service.updateImageOrder(1, 1, 2)).toBe(updatedPost);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['media'] });
      expect(repo.save).toHaveBeenCalledWith(updatedPost);
    });

    it('should throw NotFoundException if post is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.updateImageOrder(1, 1, 2)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if one of the images is not found', async () => {
      const image1 = { id: 1, order: 1 } as PostMedia;
      const post = { id: 1, title: 'Post 1', media: [image1] } as Post;

      jest.spyOn(repo, 'findOne').mockResolvedValue(post);

      await expect(service.updateImageOrder(1, 1, 2)).rejects.toThrow(NotFoundException);
    });
  });
});
