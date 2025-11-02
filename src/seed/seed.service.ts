import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Organization } from 'src/auth/entity/organization.entity';
import { UserRoles } from 'src/auth/entity/user-roles';
import { User } from 'src/auth/entity/user.entity';
import { CryptoUtils } from 'src/common/utils/crypto.utils';
import { EntityManager } from 'typeorm';
import { randomInt } from 'crypto';

@Injectable()
export class SeedService {
  constructor(@InjectEntityManager() private readonly em: EntityManager) {
    this.seed();
  }

  async seed() {
    console.log('seed start');
    console.time();
    await this.seedOrganization();
    await this.seedRoles();
    await this.seedUsers(100);
    console.log('seed end');
    console.timeEnd();
  }

  async seedOrganization() {
    if ((await this.em.count(Organization)) !== 0) return;
    const roles = [{ name: 'organ1' }, { name: 'organ2' }, { name: 'organ3' }];
    const rolesEntities = this.em.create(Organization, roles);
    await this.em.save(rolesEntities);
  }

  async seedRoles() {
    if ((await this.em.count(UserRoles)) !== 0) return;
    const roles = [{ role: 'admin' }, { role: 'operator' }, { role: 'reader' }];
    const rolesEntities = this.em.create(UserRoles, roles);
    await this.em.save(rolesEntities);
  }

  async seedUsers(count: number) {
    // Skip seeding if any users already exist
    if ((await this.em.count(User)) !== 0) return;

    const users: User[] = [];

    const orgNames = ['organ1', 'organ2', 'organ3'];
    const roleNames = ['admin', 'operator', 'reader'];

    for (let i = 1; i <= count; i++) {
      // Random organization
      const orgName = orgNames[randomInt(orgNames.length)];
      const organ = await this.em.findOneBy(Organization, { name: orgName });
      if (!organ) continue; // safety

      // Random role
      const roleName = roleNames[randomInt(roleNames.length)];
      const role = await this.em.findOneBy(UserRoles, { role: roleName });
      if (!role) continue; // safety

      const user = new User();
      user.username = `user${i}`;
      user.organization = organ;
      user.role = role;
      user.passwordHash = await CryptoUtils.hashPassword('123');

      users.push(user);
    }

    await this.em.save(users);
  }
}
