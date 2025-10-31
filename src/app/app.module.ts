import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from '../common/middlewares/logger/logger.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Organization } from 'src/auth/entity/organization.entity';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    /*   TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db1.db',
      entities: [Organization],
      synchronize: true,
    }),
   
    TypeOrmModule.forRoot({
      type: 'mssql',
      database: 'db2.db',
      entities: [Organization],
      dataSourceName: 'db2',
    }), */

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: 'db1.db',
        synchronize: true,
        entities: [Organization],

        // database: configService.get<string>('DB_NAME'),
        //autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
