import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OrganizationCreateRequest } from './contract/request/organization-create.request';
import { OrganizationDto } from './contract/dto/organization.dto';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('Organization')
  createOrganization(
    @Body() payload: OrganizationCreateRequest,
  ): Promise<OrganizationDto> {
    return this.authService.createOrganization(payload);
  }
}
