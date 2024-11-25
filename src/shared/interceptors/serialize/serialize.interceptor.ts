import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PageBlankDto } from '@shared/pagination/page-blank.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {};
}

// Custom decorator to apply the SerializeInterceptor with the provided DTO
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto, new Reflector()));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  // The DTO class to which the response data will be transformed
  constructor(
    private dto: any,
    private reflector: Reflector,
  ) {}

  // Intercept the response and transform it to the specified DTO class
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check if pagination is enabled for the current handler
    const paginate = this.reflector.get<boolean>(
      'paginate',
      context.getHandler(),
    );

    if (paginate) {
      // If pagination is enabled, transform the response data to a paginated DTO class
      return next.handle().pipe(
        map((data: any) => {
          const transformedData = plainToClassFromExist(
            new PageBlankDto(this.dto),
            data,
            {
              strategy: 'excludeAll', // Exclude all properties not explicitly exposed
              excludeExtraneousValues: true, // Exclude properties not defined in the DTO
            },
          );
          return transformedData;
        }),
      );
    } else {
      // If pagination is not enabled, transform the response data to the specified DTO class
      return next.handle().pipe(
        map((data: any) => {
          // Transform the response data to an instance of the DTO class, excluding extraneous values
          return plainToInstance(this.dto, data, {
            strategy: 'excludeAll', // Exclude all properties not explicitly exposed
            excludeExtraneousValues: true, // Exclude properties not defined in the DTO
          });
        }),
      );
    }
  }
}
