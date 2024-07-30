import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaService } from '../prisma/prisma.module';
import { BadRequestException } from '@nestjs/common';
import { FindAllRolesDto } from './dto/find.all.roles.dto';

describe('RolesService', () => {
  let service: RolesService;

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
            },
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
    await expect(service.create(roles)).rejects.toThrow('Role already exists');
  });

  it('should not be create a role if the slug is longer than 60 characters', async () => {
    const roles: CreateRoleDto = {
      slug: 'User gaçlkjaçlkjhadçlkjedlçkjyeriohyernbadlçjkhgadçlhkjapodihujaqploiyujadpioujaqpolijuh',
    };
    await expect(service.create(roles)).rejects.toThrow(
      'The slug cannot be longer than 60 characters',
    );
  });

  describe('Find all roles', () => {
    it('should be list all roles', async () => {
      const roles: FindAllRolesDto[] = [{ id: 1, slug: 'User' }];
      jest.spyOn(service, 'findAll').mockImplementation(async () => roles);
      const result = await service.findAll();
      expect(result).toEqual([{ id: 1, slug: 'User' }]);
    });
    it('should return an empty role list', async () => {
      const roles: FindAllRolesDto[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => roles);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });
});
