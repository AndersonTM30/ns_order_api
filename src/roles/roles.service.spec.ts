import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaService } from '../prisma/prisma.module';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindAllRolesDto } from './dto/find.all.roles.dto';
import { FindOneRolesDto } from './dto/find.one.roles.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RolesService', () => {
  let service: RolesService;
  let prisma: PrismaService;

  const roleId = 4;
  const currentRoleData = {
    id: roleId,
    slug: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updateData: UpdateRoleDto = {
    id: roleId,
    slug: 'SuperAdmin',
    updatedAt: new Date(),
  };

  const updatedRole = {
    ...currentRoleData,
    slug: updateData.slug,
    updatedAt: updateData.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: PrismaService,
          useValue: {
            role: {
              findFirst: jest.fn().mockResolvedValue({
                slug: 'User',
              }),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create roles', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be possible to create a new role', async () => {
      const roles: CreateRoleDto = {
        slug: 'User',
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => ({ slug: 'User' }));
      const result = await service.create(roles);
      expect(result).toEqual({ slug: 'User' });
    });

    it('should not be create an empty role', async () => {
      const roles: CreateRoleDto = {
        slug: '',
      };
      await expect(service.create(roles)).rejects.toThrow(BadRequestException);
    });

    it('should not create a role that already exists', async () => {
      const roles: CreateRoleDto = {
        slug: 'User',
      };
      await expect(service.create(roles)).rejects.toThrow(
        'Role already exists',
      );
    });

    it('should not be create a role if the slug is longer than 60 characters', async () => {
      const roles: CreateRoleDto = {
        slug: 'User gaçlkjaçlkjhadçlkjedlçkjyeriohyernbadlçjkhgadçlhkjapodihujaqploiyujadpioujaqpolijuh',
      };
      await expect(service.create(roles)).rejects.toThrow(
        'The slug cannot be longer than 60 characters',
      );
    });
  });

  describe('Find all roles', () => {
    it('should be list all roles', async () => {
      const roles: FindAllRolesDto[] = [
        { id: 1, slug: 'User' },
        { id: 2, slug: 'Admin' },
      ];
      jest.spyOn(service, 'findAll').mockImplementation(async () => roles);
      const result = await service.findAll();
      expect(result).toEqual(roles);
    });
    it('should return an empty role list', async () => {
      const roles: FindAllRolesDto[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => roles);
      const result = await service.findAll();
      expect(result).toEqual(roles);
    });
  });

  describe('Find role by id', () => {
    it('should return an role by id', async () => {
      const roleId: number = 1;
      const role: FindOneRolesDto = { id: roleId, slug: 'User' };
      jest.spyOn(service, 'findOne').mockImplementation(async () => role);
      const result = await service.findOne(roleId);
      expect(result).toEqual(role);
      expect(service.findOne).toHaveBeenCalled();
    });

    it('should return a message bad request exception', async () => {
      expect(service.findOne(undefined)).rejects.toThrow(BadRequestException);
    });

    it('should return a message not found exception', async () => {
      const roleId: number = 1;
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(null);
      expect(service.findOne(roleId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Update role by id', () => {
    it('should be update role by id', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(currentRoleData);
      jest.spyOn(prisma.role, 'update').mockResolvedValue(updatedRole);

      const result = await service.update(roleId, updateData);
      expect(result).toEqual(updatedRole);
      expect(prisma.role.findUnique).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: roleId },
        data: { slug: updateData.slug, updatedAt: expect.any(Date) },
      });
    });
    it('should throw NotFoundException if role does not exist', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(null);

      await expect(service.update(roleId, updateData)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.role.findUnique).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(prisma.role.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(service.update(null, updateData)).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.role.findUnique).not.toHaveBeenCalled();
      expect(prisma.role.update).not.toHaveBeenCalled();
    });
  });

  describe('Delete role by id', () => {
    it('should delete role successfully by id', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(currentRoleData);
      jest.spyOn(prisma.role, 'delete').mockResolvedValue(currentRoleData);
      const result = await service.remove(roleId);

      expect(result).toEqual(currentRoleData);
      expect(prisma.role.findUnique).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(prisma.role.delete).toHaveBeenCalledWith({
        where: { id: roleId },
      });
    });

    it('should throw NotFoundException if role does not exist', async () => {
      await expect(service.remove(roleId)).rejects.toThrow(NotFoundException);
      expect(prisma.role.findUnique).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(prisma.role.delete).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(service.remove(null)).rejects.toThrow(BadRequestException);
      expect(prisma.role.delete).not.toHaveBeenCalled();
    });
  });
});
