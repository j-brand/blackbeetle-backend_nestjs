import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@entities/comment.entity';
import { NotFoundException } from '@nestjs/common';

const mockComment = {
  id: 1,
  name: 'Test Comment',
  content: 'This is a test comment',
  post: { id: 1 },
  created_at: new Date(),
};

const mockCommentsService = {
  create: jest.fn().mockResolvedValue(mockComment),
  findAll: jest.fn().mockResolvedValue([mockComment]),
  findOne: jest.fn().mockResolvedValue(mockComment),
  update: jest.fn().mockResolvedValue(mockComment),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a comment', async () => {
    const createCommentDto: CreateCommentDto = {
      name: 'Test Comment',
      content: 'This is a test comment',
      post_id: 1,
    };
    const result = await controller.create(createCommentDto);
    expect(result).toEqual(mockComment);
    expect(service.create).toHaveBeenCalledWith(createCommentDto);
  });

  it('should return all comments', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockComment]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a comment by id', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockComment);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a comment', async () => {
    const updateCommentDto: UpdateCommentDto = {
      name: 'Updated Comment',
      content: 'This is an updated comment',
      post_id: 1,
    };
    const result = await controller.update('1', updateCommentDto);
    expect(result).toEqual(mockComment);
    expect(service.update).toHaveBeenCalledWith(1, updateCommentDto);
  });

  it('should delete a comment', async () => {
    const result = await controller.remove('1');
    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if comment not found', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
    await expect(controller.findOne('2')).rejects.toThrow(NotFoundException);
  });
});
