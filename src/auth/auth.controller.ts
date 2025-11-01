import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OrganizationCreateRequest } from './contract/request/organization-create.request';
import { OrganizationDto } from './contract/dto/organization.dto';
import { UserCreateRequest } from './contract/request/user-create.request';
import { UserDto } from './contract/dto/user.dto';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('User')
  createUser(@Body() payload: UserCreateRequest): Promise<UserDto> {
    return this.authService.createUser(payload);
  }

  @Get('Organization')
  getOrganizations(): Promise<OrganizationDto[]> {
    return this.authService.getOrganizations();
  }

  @Post('Organization')
  createOrganization(
    @Body() payload: OrganizationCreateRequest,
  ): Promise<OrganizationDto> {
    return this.authService.createOrganization(payload);
  }
}
