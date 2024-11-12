import { SerializeInterceptor } from './serialize.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { Expose, plainToInstance } from 'class-transformer';

class TestDto {
  @Expose()
  prop: string;
}

describe('SerializeInterceptor', () => {
  it('should be defined', () => {
    expect(new SerializeInterceptor(TestDto)).toBeDefined();
  });

  it('should transform response data to the specified DTO class', (done) => {
    const interceptor = new SerializeInterceptor(TestDto);
    const context: ExecutionContext = {} as any;
    const next: CallHandler = {
      handle: () => of({ prop: 'value', extra: 'extraValue' }),
    };

    interceptor.intercept(context, next).subscribe({
      next: (result) => {
        expect(result).toBeInstanceOf(TestDto);
        expect(result).toEqual({ prop: 'value' });
        done();
      },
    });
  });

  it('should exclude extraneous values from the response data', (done) => {
    const interceptor = new SerializeInterceptor(TestDto);
    const context: ExecutionContext = {} as any;
    const next: CallHandler = {
      handle: () => of({ prop: 'value', extra: 'extraValue' }),
    };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({ prop: 'value' });
      expect(result).not.toHaveProperty('extra');
      done();
    });
  });

  it('should handle empty response data', (done) => {
    const interceptor = new SerializeInterceptor(TestDto);
    const context: ExecutionContext = {} as any;
    const next: CallHandler = {
      handle: () => of({}),
    };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toBeInstanceOf(TestDto);
      expect(result).toEqual({});
      done();
    });
  });

  it('should handle null response data', (done) => {
    const interceptor = new SerializeInterceptor(TestDto);
    const context: ExecutionContext = {} as any;
    const next: CallHandler = {
      handle: () => of(null),
    };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should handle array response data', (done) => {
    const interceptor = new SerializeInterceptor(TestDto);
    const context: ExecutionContext = {} as any;
    const next: CallHandler = {
      handle: () => of([{ prop: 'value1' }, { prop: 'value2' }]),
    };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(TestDto);
      expect(result[0]).toEqual({ prop: 'value1' });
      expect(result[1]).toBeInstanceOf(TestDto);
      expect(result[1]).toEqual({ prop: 'value2' });
      done();
    });
  });
});
