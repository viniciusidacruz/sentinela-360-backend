import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodType, ZodError } from 'zod';

@Injectable()
export class ZodValidationSilentPipe implements PipeTransform {
  constructor(
    private readonly schema: ZodType,
    private readonly genericErrorMessage: string,
  ) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: this.genericErrorMessage,
        });
      }
      throw new BadRequestException(this.genericErrorMessage);
    }
  }
}
