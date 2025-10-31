import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entity/organization.entity';
import { Repository } from 'typeorm';
import { OrganizationCreateRequest } from './contract/request/organization-create.request';
import { plainToInstance } from 'class-transformer';
import { OrganizationDto } from './contract/dto/organization.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Organization)
    private readonly repOrg: Repository<Organization>,
  ) {}

  async createOrganization(
    payload: OrganizationCreateRequest,
  ): Promise<OrganizationDto> {
    const exists = await this.repOrg.findOne({
      where: { name: payload.name },
    });
    if (exists) throw new ConflictException('Organization name already exists');

    const org = this.repOrg.create(payload);
    const savedOrg = await this.repOrg.save(org);

    return plainToInstance(OrganizationDto, savedOrg);
  }
}
