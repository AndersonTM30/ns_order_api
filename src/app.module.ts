import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [RolesModule, PermissionsModule],
})
export class AppModule {}
