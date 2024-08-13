import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '../prisma/prisma.module';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { FindAllPermissionsDto } from './dto/find.all.permissions.dto';

const fakePermissions = [
  {
    id: 1,
    slug: 'create',
  },
  {
    id: 2,
    slug: 'update',
  },
  {
    id: 3,
    slug: 'read',
  },
  {
    id: 4,
    slug: 'delete',
  },
];

const mockPrismaService = {
  permission: {
    create: jest.fn(),
    findAll: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  },
};

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create permission', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be create a new permission', async () => {
      const expectedRequest = { slug: 'create' };
      const expectedResponse = {
        id: 1,
        slug: 'create',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(prisma.permission, 'create')
        .mockResolvedValue(expectedResponse);
      const response = await service.create(expectedRequest);
      expect(response).toEqual(expectedResponse);
      expect(prisma.permission.create).toHaveBeenCalledTimes(1);
    });
    it('should not be create a empty permission', async () => {
      const permission = {
        slug: '',
      };
      expect(service.create(permission)).rejects.toThrow(BadRequestException);
    });
    it('should not be create a permission if the slug is longer than 60 characters', async () => {
      const permission = {
        slug: 'askjghaskghtweqkljuhagvasklgjhaslkjghasdlkjghaksljghtkljasdhgakjlsdhgakljshgaljksdhgasjkhgjkashdgjkhdsaghadsljkhgakljhg',
      };
      expect(service.create(permission)).rejects.toThrow(
        'The slug cannot be longer than 60 characters',
      );
    });
    it('should not create a permission that already exists', async () => {
      const existingPermissionSlug = 'create';
      const permission = {
        slug: existingPermissionSlug,
      };
      jest
        .spyOn(mockPrismaService.permission, 'findFirst')
        .mockResolvedValue(existingPermissionSlug);
      await expect(service.create(permission)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('Find all permissions', () => {
    it('should be return all permissions', async () => {
      const expectedResponse: FindAllPermissionsDto[] = [
        {
          id: 1,
          slug: 'create',
        },
        {
          id: 2,
          slug: 'update',
        },
        {
          id: 3,
          slug: 'read',
        },
        {
          id: 4,
          slug: 'delete',
        },
      ];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async () => fakePermissions);
      const result = await service.findAll();
      expect(result).toEqual(expectedResponse);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return a empty permission list', async () => {
      const emptyList = [];
      const expectedResponse = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(emptyList);
      const result = await service.findAll();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('Find permission by id', () => {
    it('should return a permission by id', async () => {
      const mockId = 1;
      const mockResult = { id: mockId, slug: 'create' };

      jest.spyOn(service, 'findOne').mockImplementation(async () => mockResult);
      expect(await service.findOne(mockId)).toEqual(fakePermissions[0]);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a message bad request exception', async () => {
      const permissionId = undefined;

      expect(service.findOne(permissionId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a message not found exception', async () => {
      const permissionId = 1;
      jest.spyOn(prisma.permission, 'findUnique').mockResolvedValue(null);

      expect(service.findOne(permissionId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Update permission by id', () => {
    const permissionId = 4;
    const currentPermissionData = {
      id: permissionId,
      slug: 'create',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatePermissionMock = {
      ...currentPermissionData,
      slug: 'teste',
      updatedAt: new Date(),
    };

    it('should be update permission by id', async () => {
      jest
        .spyOn(prisma.permission, 'findUnique')
        .mockResolvedValue(currentPermissionData);
      jest
        .spyOn(prisma.permission, 'update')
        .mockResolvedValue(updatePermissionMock);

      const result = await service.update(
        fakePermissions[0].id,
        updatePermissionMock,
      );
      expect(result).toEqual(updatePermissionMock);
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: { id: fakePermissions[0].id },
      });
      expect(prisma.permission.update).toHaveBeenCalledWith({
        where: { id: fakePermissions[0].id },
        data: { slug: updatePermissionMock.slug, updatedAt: expect.any(Date) },
      });
    });
    it('should throw NotFoundException if permission does not exist', async () => {
      jest.spyOn(prisma.permission, 'findUnique').mockResolvedValue(null);
      await expect(
        service.update(permissionId, updatePermissionMock),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: { id: permissionId },
      });
      expect(prisma.permission.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(service.update(null, updatePermissionMock)).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.permission.findUnique).not.toHaveBeenCalled();
      expect(prisma.permission.update).not.toHaveBeenCalled();
    });
  });

  describe('Delete permission by id', () => {
    it('should be delete permission by id', async () => {
      const permissionId = 1;
      const currentPermissionData = {
        id: permissionId,
        slug: 'create',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prisma.permission, 'findUnique')
        .mockResolvedValue(currentPermissionData);
      jest
        .spyOn(prisma.permission, 'delete')
        .mockResolvedValue(currentPermissionData);

      const result = await service.remove(currentPermissionData.id);
      expect(result).toEqual(currentPermissionData);
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: { id: permissionId },
      });
      expect(prisma.permission.delete).toHaveBeenCalledWith({
        where: { id: permissionId },
      });
    });
  });
});
