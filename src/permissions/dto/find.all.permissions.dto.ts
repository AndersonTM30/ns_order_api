import { ApiProperty } from '@nestjs/swagger';

export class FindAllPermissionsDto {
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
}
