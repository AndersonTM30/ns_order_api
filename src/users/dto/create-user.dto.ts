export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  roleId: number;
  permissionIds: number[];
}
