import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import * as fs from 'fs';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class DeleteFileOnFailFilter<T> implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();


    const getFiles = (files: Express.Multer.File[] | unknown | undefined) => {
      if (!files) return [];
      if (Array.isArray(files)) return files;
      return [files]; // single file
    };

    const files = getFiles(request.file);
    console.log(files)
    files.map((file: Express.Multer.File) => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Error deleting file', err);
        }
      });
    });

    response.status(status).json(exception.getResponse());
  }
}
