import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ValidateEligibilityDTO } from '@src/modules/eligibility/dtos/ValidateEligibility.dto';
import {
  classesDeConsumo,
  modalidadesTarifarias,
  tiposDeConexao,
} from '@src/modules/eligibility/eligibility.enum';
import { ValidateEligibilityService } from '@src/modules/eligibility/useCases/ValidateEligibility.service';

@Controller({
  path: 'eligibility',
  version: '1',
})
@ApiTags('Eligibilidade de Clientes')
export class EligibilityController {
  constructor(
    private readonly validateEligibilityService: ValidateEligibilityService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Valida a eligibilidade de um cliente',
  })
  @ApiQuery({ name: 'numeroDoDocumento', type: 'string', required: true })
  @ApiQuery({ name: 'tipoDeConexao', enum: tiposDeConexao, required: true })
  @ApiQuery({ name: 'classeDeConsumo', enum: classesDeConsumo, required: true })
  @ApiQuery({
    name: 'modalidadeTarifaria',
    enum: modalidadesTarifarias,
    required: true,
  })
  @ApiQuery({
    name: 'historicoDeConsumo',
    type: 'number',
    isArray: true,
    required: true,
  })
  validateEligibility(@Query() eligibilityParams: ValidateEligibilityDTO) {
    return this.validateEligibilityService.execute(eligibilityParams);
  }
}
