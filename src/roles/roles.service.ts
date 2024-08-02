import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.module';
import { RoleOutputDto } from './dto/role.output.dto';
import { FindAllRolesDto } from './dto/find.all.roles.dto';
import { FindOneRolesDto } from './dto/find.one.roles.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRoleDto): Promise<RoleOutputDto> {
    if (!data.slug) {
      throw new BadRequestException('Role is not empty');
    }
    const roleExist = await this.prisma.role?.findFirst({
      where: { slug: data.slug },
    });

    if (data.slug.length > 60) {
      throw new BadRequestException(
        'The slug cannot be longer than 60 characters',
      );
    }

    if (roleExist) {
      throw new ConflictException('Role already exists');
    }
    const createdRole = await this.prisma.role?.create({
      data,
      select: {
        slug: true,
      },
    });
    return createdRole;
  }

  async findAll(): Promise<FindAllRolesDto[]> {
    const roles = await this.prisma.role.findMany({
      select: {
        id: true,
        slug: true,
      },
    });
    return roles;
  }

  async findOne(id: number): Promise<FindOneRolesDto> {
    if (!id) throw new BadRequestException('Invalid parameter!');

    const role = await this.prisma.role.findUnique({
      where: { id: id },
      select: { id: true, slug: true },
    });

    if (!role) {
      throw new NotFoundException('Role not found!');
    }
    return role;
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateRoleDto> {
    if (!id) throw new BadRequestException('Invalid parameter!');
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) throw new NotFoundException('Role not found!');

    return this.prisma.role.update({
      where: {
        id,
      },
      data: { slug: updateRoleDto.slug, updatedAt: new Date() },
    });
  }

  async remove(id: number) {
    if (!id) throw new BadRequestException('Invalid parameter!');
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) throw new NotFoundException('Role not found!');
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
