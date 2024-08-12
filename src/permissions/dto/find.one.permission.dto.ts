import { ApiProperty } from '@nestjs/swagger';

export class FindOnePermissionDto {
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
}
