import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entity/organization.entity';
import { Repository } from 'typeorm';
import { OrganizationCreateRequest } from './contract/request/organization-create.request';
import { plainToInstance } from 'class-transformer';
import { OrganizationDto } from './contract/dto/organization.dto';
import { UserCreateRequest } from './contract/request/user-create.request';
import { UserDto } from './contract/dto/user.dto';
import { User } from './entity/user.entity';
import { CryptoUtils } from 'src/common/utils/crypto.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Organization)
    private readonly repOrg: Repository<Organization>,

    @InjectRepository(User)
    private readonly repUser: Repository<User>,
  ) {}

  async createUser(payload: UserCreateRequest): Promise<UserDto> {
    const exists = await this.repUser.findOne({
      where: { username: payload.username },
    });
    if (exists) throw new ConflictException('Username already exists');
    const passwordHash = await CryptoUtils.hashPassword(payload.password);

    const organization = await this.repOrg.findOneBy({
      id: payload.organization_id,
    });

    if (!organization) throw new BadRequestException('organization not found');

    const user = this.repUser.create({
      ...payload,
      passwordHash,
      organization,
    });
    const savedUser = await this.repUser.save(user);
    const dto = plainToInstance(UserDto, savedUser);
    return dto;
  }

  async createOrganization(
    payload: OrganizationCreateRequest,
  ): Promise<OrganizationDto> {
    const exists = await this.repOrg.findOne({
      where: { name: payload.name },
    });
    if (exists) throw new ConflictException('Organization name already exists');

    const org = this.repOrg.create(payload);
    const savedOrg = await this.repOrg.save(org);
    const dto = plainToInstance(OrganizationDto, savedOrg);
    return dto;
  }

  async getOrganizations(): Promise<OrganizationDto[]> {
    const organs = await this.repOrg.find();
    return organs.map((val) => plainToInstance(OrganizationDto, val));
  }
}
