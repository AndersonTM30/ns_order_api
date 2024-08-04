import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  id: number;
  @ApiProperty({
    description: 'The name of role',
    example: 'Admin',
    type: 'string',
    maxLength: 60,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
  updatedAt: Date;
}
