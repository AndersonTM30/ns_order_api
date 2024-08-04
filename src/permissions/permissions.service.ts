import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '../prisma/prisma.module';
import { CreatePermissionOutputDto } from './dto/create.permission.output.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePermissionDto): Promise<CreatePermissionOutputDto> {
    const permissionCreated: CreatePermissionOutputDto =
      await this.prisma.permission.create({
        data,
        select: {
          id: true,
          slug: true,
        },
      });

    return permissionCreated;
  }

  async findAll() {
    return `This action returns all permissions`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  async remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
