import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodType, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        throw new BadRequestException({
          message: 'Dados de entrada inválidos',
          errors: formattedErrors,
        });
      }
      throw new BadRequestException('Erro de validação');
    }
  }
}
