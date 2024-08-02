import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from '../prisma/prisma.module';
import { RoleOutputDto } from './dto/role.output.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService, PrismaService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a new role', async () => {
    const role: RoleOutputDto = { slug: 'User' };

    jest.spyOn(rolesService, 'create').mockImplementation(async () => role);

    expect(await controller.create(role)).toEqual({ slug: 'User' });
  });
});
