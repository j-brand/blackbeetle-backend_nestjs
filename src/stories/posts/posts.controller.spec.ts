import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { NotFoundException } from '@nestjs/common';
import { PostMedia } from '@entities/post_media.entity';
import { AuthService } from '@auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '@users/users.service';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            addImage: jest.fn(),
          },
        },
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addImages', () => {
    it('should add images to a post', async () => {
      const files = [{ filename: 'image.jpg' }] as Express.Multer.File[];
      const postMedia = [{ id: 1, order: 1, media: { id: 1, title: 'image.jpg' } }] as PostMedia[];

      jest.spyOn(service, 'addImage').mockResolvedValue(postMedia);

      const result = await controller.addImages(files, '1');

      expect(result).toEqual(postMedia);
      expect(service.addImage).toHaveBeenCalledWith(1, files[0]);
    });

    it('should throw NotFoundException if post is not found', async () => {
      const files = [{ filename: 'image.jpg' }] as Express.Multer.File[];

      jest.spyOn(service, 'addImage').mockRejectedValue(new NotFoundException());

      await expect(controller.addImages(files, '1')).rejects.toThrow(NotFoundException);
    });

  });

});
