import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {};
}

// Custom decorator to apply the SerializeInterceptor with the provided DTO
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  // The DTO class to which the response data will be transformed
  constructor(private dto: any) {}

  // Intercept the response and transform it to the specified DTO class
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // Transform the response data to an instance of the DTO class, excluding extraneous values
        return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
