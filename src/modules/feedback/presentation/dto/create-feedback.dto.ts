import { ApiProperty } from '@nestjs/swagger';
import { CreateFeedbackInput } from './create-feedback.schema';

export class CreateFeedbackDto implements CreateFeedbackInput {
  @ApiProperty({
    description: 'Company ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  companyId: string;

  @ApiProperty({
    description: 'Rating (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    description: 'Comment (optional)',
    example: 'Great service!',
    required: false,
  })
  comment?: string;
}
