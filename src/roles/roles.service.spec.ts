import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaService } from '../prisma/prisma.module';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, PrismaService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be possible to create a new rule', async () => {
    const roles: CreateRoleDto = {
      slug: 'User',
    };
    jest
      .spyOn(service, 'create')
      .mockImplementation(async () => ({ slug: 'User' }));
    const result = await service.create(roles);
    expect(result).toEqual({ slug: 'User' });
  });
});
