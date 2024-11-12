import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as sharp from 'sharp';
import * as path from 'path';

jest.mock('sharp');
jest.mock('path');

describe('ImageService', () => {
  let service: ImageService;
  let imageQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: getQueueToken('image'),
          useValue: {
            add: jest.fn(), // Mock the add method to do nothing
          },
        },
      ],
    }).compile();

    imageQueue = module.get<Queue>(getQueueToken('image'));
    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
