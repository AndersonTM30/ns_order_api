import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.module';
import { RoleOutputDto } from './dto/role.output.dto';

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
      throw new BadRequestException('Role already exists');
    }
    const createdRole = await this.prisma.role?.create({
      data,
      select: {
        slug: true,
      },
    });
    return createdRole;
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role ${updateRoleDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
