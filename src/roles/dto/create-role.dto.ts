import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of role',
    example: 'Admin',
    type: 'string',
    maxLength: 60,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
