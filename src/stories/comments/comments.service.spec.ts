import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CommentsService } from './comments.service';
import { Comment } from '@entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

const mockComment = {
  id: 1,
  name: 'Test Comment',
  content: 'This is a test comment',
  post: { id: 1 },
  created_at: new Date(),
};

const mockCommentRepository = {
  create: jest.fn().mockReturnValue(mockComment),
  save: jest.fn().mockResolvedValue(mockComment),
  find: jest.fn().mockResolvedValue([mockComment]),
  findOne: jest.fn().mockResolvedValue(mockComment),
  update: jest.fn().mockResolvedValue(mockComment),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('CommentsService', () => {
  let service: CommentsService;
  let repo: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repo = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a comment', async () => {
    const createCommentDto: CreateCommentDto = {
      name: 'Test Comment',
      content: 'This is a test comment',
      post_id: 1,
    };
    const result = await service.create(createCommentDto);
    expect(result).toEqual(mockComment);
    expect(repo.create).toHaveBeenCalledWith({
      ...createCommentDto,
      post: { id: createCommentDto.post_id },
    });
    expect(repo.save).toHaveBeenCalledWith(mockComment);
  });

  it('should return all comments', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockComment]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should return a comment by id', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockComment);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a comment', async () => {
    const updateCommentDto: UpdateCommentDto = {
      name: 'Updated Comment',
      content: 'This is an updated comment',
      post_id: 1,
    };
    const result = await service.update(1, updateCommentDto);
    expect(result).toEqual(mockComment);
    expect(repo.update).toHaveBeenCalledWith(1, updateCommentDto);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should delete a comment', async () => {
    await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if comment not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
  });
});
