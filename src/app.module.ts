import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GetDataModule } from './get-data/get-data.module';
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV
    }
  ), GetDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
