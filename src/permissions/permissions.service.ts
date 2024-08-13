import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '../prisma/prisma.module';
import { CreatePermissionOutputDto } from './dto/create.permission.output.dto';
import { FindAllPermissionsDto } from './dto/find.all.permissions.dto';
import { FindOnePermissionDto } from './dto/find.one.permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePermissionDto): Promise<CreatePermissionOutputDto> {
    if (!data.slug) throw new BadRequestException('Permission is not empty');

    const permissionExist = await this.prisma.permission.findFirst({
      where: { slug: data.slug },
    });

    if (permissionExist)
      throw new ConflictException('Permission already exists');

    if (data.slug.trim().length > 60)
      throw new BadRequestException(
        'The slug cannot be longer than 60 characters',
      );

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

  async findAll(): Promise<FindAllPermissionsDto[]> {
    const permissions = await this.prisma.permission.findMany({
      select: {
        id: true,
        slug: true,
      },
    });

    return permissions;
  }

  async findOne(id: number): Promise<FindOnePermissionDto> {
    if (!id) throw new BadRequestException('Invalid parameter');

    const permission = await this.prisma.permission.findUnique({
      where: { id: id },
      select: { id: true, slug: true },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found!');
    }
    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    if (!id) throw new BadRequestException('Invalid parameter!');
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) throw new NotFoundException('Permission not found!');

    return this.prisma.permission.update({
      where: {
        id,
      },
      data: { slug: updatePermissionDto.slug, updatedAt: new Date() },
    });
  }

  async remove(id: number) {
    if (!id) throw new BadRequestException('Invalid parameter!');
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) throw new NotFoundException('Permission not found!');

    return this.prisma.permission.delete({
      where: { id },
    });
  }
}
