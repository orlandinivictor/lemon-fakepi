import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOkResponse({
    status: 200,
    description: 'Successful validation',
    content: {
      'application/json': {
        examples: {
          EligibleResponse: {
            value: {
              elegivel: true,
              economiaAnualDeCO2: 5553.24,
            },
          },
          IneligibleResponse: {
            value: {
              elegivel: false,
              razoesDeInelegibilidade: [
                'Classe de consumo não aceita',
                'Modalidade tarifária não aceita',
              ],
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request response',
    content: {
      'application/json': {
        example: {
          message: [
            'historicoDeConsumo must contain no more than 12 elements',
            'historicoDeConsumo must contain at least 12 elements',
            'historicoDeConsumo should not be empty',
            'historicoDeConsumo must be an array',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
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
