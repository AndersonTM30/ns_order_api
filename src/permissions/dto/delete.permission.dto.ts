import { ApiProperty } from '@nestjs/swagger';

export class DeletePermissionDto {
  @ApiProperty({
    description: 'The id of permission',
    example: 1,
    type: 'number',
  })
  id: number;
  @ApiProperty({
    description: 'The name of permission',
    example: 'create',
    type: 'string',
    maxLength: 60,
  })
  slug: string;
  @ApiProperty({
    description: 'The timestamp of permission created',
    example: '2024-07-29T19:19:26.348Z',
    type: 'Date',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'The timestamp of permission updated',
    example: '2024-07-29T19:19:26.348Z',
    type: 'Date',
  })
  updatedAt: Date;
}
