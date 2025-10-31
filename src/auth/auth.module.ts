import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entity/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
