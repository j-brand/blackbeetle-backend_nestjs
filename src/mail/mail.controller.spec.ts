import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { HttpException } from '@nestjs/common';

describe('MailController', () => {
  let controller: MailController;
  let mailService: MailService;

  const mockMailService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    controller = module.get<MailController>(MailController);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMail', () => {
    const mockMailDto = {
      to: 'test@example.com',
      subject: 'Test Subject',
      templateName: 'welcome',
      context: { name: 'John' }
    };

    it('should successfully queue an email', async () => {
      mockMailService.sendMail.mockResolvedValue({
        status: 'queued',
        message: 'Mail queued successfully'
      });

      const result = await controller.sendMail(mockMailDto);
      expect(result.message).toBe('Mail queued successfully');
    });

    it('should throw an exception when mail service fails', async () => {
      mockMailService.sendMail.mockResolvedValue({
        status: 'error',
        message: 'Failed to queue mail'
      });

      await expect(controller.sendMail(mockMailDto)).rejects.toThrow(HttpException);
    });
  });
});
