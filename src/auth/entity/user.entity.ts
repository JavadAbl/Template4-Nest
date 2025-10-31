import { randomUUID } from 'crypto';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { UserRoles } from './user-roles';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActive: Date;

  @ManyToOne(() => Organization, (entity) => entity.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => UserRoles, (entity) => entity.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  role: UserRoles;
}
