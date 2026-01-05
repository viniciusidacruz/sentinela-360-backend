import { ApiProperty } from '@nestjs/swagger';
import { UpdateFeedbackInput } from './update-feedback.schema';

export class UpdateFeedbackDto implements UpdateFeedbackInput {
  @ApiProperty({
    description: 'Rating (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  rating?: number;

  @ApiProperty({
    description: 'Comment',
    example: 'Updated comment',
    required: false,
    nullable: true,
  })
  comment?: string | null;
}
