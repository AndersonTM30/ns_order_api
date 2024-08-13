import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

describe('PermissionsController', () => {
  let controller: PermissionsController;

  const permissionId: string = '1';

  const mockPermissionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const createPermissionDto: CreatePermissionDto = {
    slug: 'create',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        { provide: PermissionsService, useValue: mockPermissionService },
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create permission', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should be create a new permission', async () => {
      await controller.create(createPermissionDto);

      expect(mockPermissionService.create).toHaveBeenCalledTimes(1);
      expect(mockPermissionService.create).toHaveBeenCalledWith(
        createPermissionDto,
      );
    });
  });

  describe('Find all permissions', () => {
    it('should be find all permissions', async () => {
      await controller.findAll();

      expect(mockPermissionService.findAll).toHaveBeenCalledTimes(1);
      expect(mockPermissionService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('Find one permission by id', () => {
    it('should be find permission by id', async () => {
      const outputId = 1;
      await controller.findOne(permissionId);

      expect(mockPermissionService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPermissionService.findOne).toHaveBeenCalledWith(outputId);
    });
  });

  describe('Update permission by id', () => {
    it('should be update permission by id', async () => {
      const outputId = 1;
      const permissionDto: UpdatePermissionDto = {
        id: parseInt(permissionId),
        slug: 'update',
        updatedAt: new Date(),
      };
      await controller.update(permissionId, permissionDto);

      expect(mockPermissionService.update).toHaveBeenCalledTimes(1);
      expect(mockPermissionService.update).toHaveBeenCalledWith(
        outputId,
        permissionDto,
      );
    });
  });

  describe('Delete permission by id', () => {
    it('should be delete a permission by id', async () => {
      const outputId = 1;
      await controller.remove(permissionId);

      expect(mockPermissionService.remove).toHaveBeenCalledTimes(1);
      expect(mockPermissionService.remove).toHaveBeenCalledWith(outputId);
    });
  });
});
