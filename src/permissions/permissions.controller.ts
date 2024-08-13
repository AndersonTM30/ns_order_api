import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindAllPermissionsDto } from './dto/find.all.permissions.dto';
import { FindOnePermissionDto } from './dto/find.one.permission.dto';
import { DeletePermissionDto } from './dto/delete.permission.dto';

@Controller('permissions')
@ApiTags('Permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({ summary: 'Create a new permission' })
  @ApiBody({
    type: CreatePermissionDto,
    description: 'Permission registration data',
  })
  @ApiCreatedResponse({
    type: CreatePermissionDto,
    description: 'Permission created successfully!',
  })
  @ApiBadRequestResponse({
    description: 'Permission is not empty',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Permission is not empty' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Permission not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Permission not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Permission already exists',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all permissions' })
  @ApiOkResponse({
    description: 'List all permissions',
    type: FindAllPermissionsDto,
    example: [
      {
        id: 1,
        slug: 'create',
      },
      {
        id: 2,
        slug: 'update',
      },
    ],
  })
  async findAll() {
    return this.permissionsService.findAll();
  }

  @ApiOperation({ summary: 'Return a permission by id' })
  @ApiOkResponse({
    description: 'Return permission data by id',
    type: FindOnePermissionDto,
  })
  @ApiNotFoundResponse({
    description: 'Permission not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Permission not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid parameter!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid parameter!' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a permission by id' })
  @ApiOkResponse({
    description: 'Update permission data by id',
    type: UpdatePermissionDto,
  })
  @ApiNotFoundResponse({
    description: 'Permission not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Permission not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid parameter!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid parameter!' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by id' })
  @ApiOkResponse({
    description: 'Delete role by id',
    type: DeletePermissionDto,
  })
  @ApiNotFoundResponse({
    description: 'Permission not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Permission not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid parameter!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid parameter!' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
