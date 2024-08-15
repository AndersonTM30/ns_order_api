import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const prismaMock = {
    user: {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    },
  };

  const createUserDto = {
    name: 'Anderson',
    email: 'email@test.com',
    password: 'secretPassword',
    isActive: true,
    roleId: 7,
    permissionIds: [1, 2, 3, 4],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('Create a new user', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be create a new user', async () => {
      const createdUser = {
        id: 1,
        name: 'Anderson',
        email: 'email@test.com',
        isActive: true,
      };
      jest.spyOn(service, 'create').mockResolvedValue(createdUser);
      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
    });

    it('should not create a new user if the name is empty', async () => {
      const invalidUser = {
        name: '',
        email: 'email@test.com',
        password: 'secretPassword',
        isActive: true,
        roleId: 7,
        permissionIds: [1, 2, 3, 4],
      };
      await expect(service.create(invalidUser)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should not create a new user if the email is empty', async () => {
      const invalidUser = {
        name: 'Anderson',
        email: '',
        password: 'secretPassword',
        isActive: true,
        roleId: 7,
        permissionIds: [1, 2, 3, 4],
      };
      await expect(service.create(invalidUser)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should not create a new user if the password is empty', async () => {
      const invalidUser = {
        name: 'Anderson',
        email: 'email@test.com',
        password: '',
        isActive: true,
        roleId: 7,
        permissionIds: [1, 2, 3, 4],
      };
      await expect(service.create(invalidUser)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should not create a new user if the isActive is null', async () => {
      const invalidUser = {
        name: 'Anderson',
        email: 'email@test.com',
        password: 'secretPassword',
        isActive: null,
        roleId: 7,
        permissionIds: [1, 2, 3, 4],
      };
      await expect(service.create(invalidUser)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should not create a new user if the roleId is null', async () => {
      const invalidUser = {
        name: 'Anderson',
        email: 'email@test.com',
        password: 'secretPassword',
        isActive: true,
        roleId: null,
        permissionIds: [1, 2, 3, 4],
      };
      await expect(service.create(invalidUser)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should not create a new user if the permissionIds is null', async () => {
      const invalidUser = {
        name: 'Anderson',
        email: 'email@test.com',
        password: 'secretPassword',
        isActive: true,
        roleId: 7,
        permissionIds: [],
      };
      await expect(service.create(invalidUser)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should return the message E-mail already registered', async () => {
      const invalidUser = {
        name: 'Anderson',
        email: 'email@test.com',
        password: 'secretPassword',
        isActive: true,
        roleId: 7,
        permissionIds: [1, 2, 3, 4],
      };
      jest.spyOn(prismaMock.user, 'findFirst').mockResolvedValueOnce({ id: 1 });
      await expect(service.create(invalidUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
