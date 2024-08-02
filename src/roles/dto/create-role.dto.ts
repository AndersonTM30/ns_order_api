import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  slug: string;
}
