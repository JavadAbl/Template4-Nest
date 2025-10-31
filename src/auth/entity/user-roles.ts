import { randomUUID } from 'crypto';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_roles')
export class UserRoles {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @Column()
  role: string;

  @OneToMany(() => User, (entity) => entity.role)
  user: User;
}
