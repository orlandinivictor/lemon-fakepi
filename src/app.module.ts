import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from '@src/app.controller';
import { EligibilityModule } from '@src/modules/eligibility/eligibility.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule,
    HttpModule,

    EligibilityModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
