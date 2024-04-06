import { Module } from '@nestjs/common';
import { EligibilityController } from '@src/modules/eligibility/infra/controllers/eligibility.controller';
import { ValidateEligibilityService } from '@src/modules/eligibility/useCases/ValidateEligibility.service';

@Module({
  controllers: [EligibilityController],
  providers: [ValidateEligibilityService],
})
export class EligibilityModule {}
