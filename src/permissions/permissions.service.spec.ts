import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '../prisma/prisma.module';
import { CreatePermissionOutputDto } from './dto/create.permission.output.dto';

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
    create: jest.fn().mockReturnValue(fakePermissions[0]),
    findAll: jest.fn().mockResolvedValue(fakePermissions),
    findUnique: jest.fn().mockResolvedValue(fakePermissions[0]),
    findOne: jest.fn().mockResolvedValue(fakePermissions[0]),
    update: jest.fn().mockResolvedValue(fakePermissions[0]),
    remove: jest.fn(),
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

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Create permission', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be create a new permission', async () => {
      const expectedRequest = { slug: 'create' };
      const expectedResponse: CreatePermissionOutputDto = {
        id: 1,
        slug: 'create',
      };
      const response = await service.create(expectedRequest);
      expect(response).toEqual(expectedResponse);
      expect(prisma.permission.create).toHaveBeenCalledTimes(1);
    });
  });
});
