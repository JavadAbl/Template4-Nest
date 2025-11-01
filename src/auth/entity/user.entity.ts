import { randomUUID } from 'crypto';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { UserRoles } from './user-roles';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @ManyToOne(() => Organization, (entity) => entity.users, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => UserRoles, (entity) => entity.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: UserRoles;
}
