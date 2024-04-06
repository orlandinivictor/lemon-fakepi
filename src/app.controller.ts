import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Healthcheck')
export class AppController {
  constructor(private readonly health: HealthCheckService) {}

  @Get('/healthcheck')
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
