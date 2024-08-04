import { ApiProperty } from '@nestjs/swagger';

export class DeleteRoleDto {
  @ApiProperty({
    description: 'The id of role',
    example: 1,
    type: 'number',
  })
  id: number;
  @ApiProperty({
    description: 'The name of role',
    example: 'Admin',
    type: 'string',
    maxLength: 60,
  })
  slug: string;
  @ApiProperty({
    description: 'The timestamp of role created',
    example: '2024-07-29T19:19:26.348Z',
    type: 'Date',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'The timestamp of role updated',
    example: '2024-07-29T19:19:26.348Z',
    type: 'Date',
  })
  updatedAt: Date;
}
