import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
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
