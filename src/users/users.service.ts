import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatedUserOutputDto } from './dto/created.user.output.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<CreatedUserOutputDto> {
    const { name, email, isActive, roleId, permissionIds } = data;
    let { password } = data;

    if (!name) throw new BadRequestException('Name is not empty');
    if (!email) throw new BadRequestException('E-mail is not empty');
    if (!password) throw new BadRequestException('Password is not empty');
    if (!isActive) throw new BadRequestException('Is Active is not empty');
    if (!roleId) throw new BadRequestException('RoleId is not empty');
    if (!permissionIds)
      throw new BadRequestException('Permission ids is not empty');
    if (permissionIds.length < 1)
      throw new BadRequestException('Permission ids is not empty');

    const emailExist = await this.prisma.user.findFirst({
      where: { email },
    });

    if (emailExist) throw new ConflictException('E-mail already registered');

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    password = hashedPassword;

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    await this.prisma.userRole.create({
      data: {
        user_id: user.id,
        role_id: roleId,
      },
    });

    const existingRolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role_id: roleId,
        permission_id: {
          in: permissionIds,
        },
      },
    });

    const newPermissions = permissionIds.filter(
      (permissionId) =>
        !existingRolePermissions.some(
          (rp) => rp.permission_id === permissionId,
        ),
    );

    if (newPermissions.length > 0) {
      const rolePermissionData = newPermissions.map((permissionId) => ({
        role_id: roleId,
        permission_id: permissionId,
      }));

      await this.prisma.rolePermission.createMany({
        data: rolePermissionData,
      });
    }

    return user;
  }

  async findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
