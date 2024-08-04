import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleOutputDto } from './dto/role.output.dto';
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
import { FindAllRolesDto } from './dto/find.all.roles.dto';
import { FindOneRolesDto } from './dto/find.one.roles.dto';
import { DeleteRoleDto } from './dto/dele.role.dto';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Role registration data',
  })
  @ApiCreatedResponse({
    type: CreateRoleDto,
    description: 'Role created successfully!',
  })
  @ApiBadRequestResponse({
    description: 'Role is not empty',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Role is not empty' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Role not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Role already exists',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleOutputDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all roles' })
  @ApiOkResponse({
    description: 'List all roles',
    type: FindAllRolesDto,
    example: [
      {
        id: 1,
        slug: 'Admin',
      },
      {
        id: 2,
        slug: 'User',
      },
    ],
  })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return a role by id' })
  @ApiOkResponse({
    description: 'Return role data by id',
    type: FindOneRolesDto,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Role not found' },
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
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a role by id' })
  @ApiOkResponse({
    description: 'Update role data by id',
    type: UpdateRoleDto,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Role not found' },
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
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete a role by id' })
  @ApiOkResponse({
    description: 'Delete role by id',
    type: DeleteRoleDto,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Role not found' },
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
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
