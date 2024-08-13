import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'The name of permission',
    example: 'create',
    type: 'string',
    maxLength: 60,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
