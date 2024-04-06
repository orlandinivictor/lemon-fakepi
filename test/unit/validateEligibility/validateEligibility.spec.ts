import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ValidateEligibilityDTO } from '@src/modules/eligibility/dtos/ValidateEligibility.dto';
import { ValidateEligibilityResponseDTO } from '@src/modules/eligibility/dtos/ValidateEligibilityResponse.dto';

import { ValidateEligibilityService } from '@src/modules/eligibility/useCases/ValidateEligibility.service';

describe('ValidateEligibilityService', () => {
  let validateEligibilityService: ValidateEligibilityService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ValidateEligibilityService],
    }).compile();

    validateEligibilityService = module.get<ValidateEligibilityService>(
      ValidateEligibilityService,
    );
  });

  it('should be defined', () => {
    expect(validateEligibilityService).toBeDefined();
  });

  it('should throw a bad request exception with invalid document number', async () => {
    try {
      validateEligibilityService.execute({
        numeroDoDocumento: '1',
        classeDeConsumo: '',
        historicoDeConsumo: [1],
        modalidadeTarifaria: '',
        tipoDeConexao: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw a bad request exception with invalid consumption history', async () => {
    try {
      validateEligibilityService.execute({
        numeroDoDocumento: '11122233344',
        classeDeConsumo: '',
        historicoDeConsumo: [
          Number('a'),
          Number('a'),
          Number('a'),
          Number('a'),
          Number('a'),
          Number('a'),
          Number('a'),
          Number('a'),
          Number('a'),
          Number('a'),
          Number('a'),
          Number('a'),
        ],
        modalidadeTarifaria: '',
        tipoDeConexao: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toStrictEqual(
        'Todos os valores do histórico de consumo devem ser números',
      );
    }
  });

  it('should throw a bad request exception with invalid consumption history amount', async () => {
    try {
      validateEligibilityService.execute({
        numeroDoDocumento: '11122233344',
        classeDeConsumo: '',
        historicoDeConsumo: [1],
        modalidadeTarifaria: '',
        tipoDeConexao: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toStrictEqual(
        'Você deve informar o histórico de consumo dos últimos 12 meses',
      );
    }
  });

  it('should throw a bad request exception with unset consumption history', async () => {
    try {
      const typescriptByPass = {
        numeroDoDocumento: '14041737706',
        classeDeConsumo: '',
        modalidadeTarifaria: '',
        tipoDeConexao: '',
      } as ValidateEligibilityDTO;

      validateEligibilityService.execute(typescriptByPass);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return an eligible response', async () => {
    const mockResponse = new ValidateEligibilityResponseDTO({
      elegivel: true,
      economiaAnualDeCO2: 5553.24,
    });

    const eligibilityResponse = validateEligibilityService.execute({
      numeroDoDocumento: '14041737706',
      classeDeConsumo: 'comercial',
      historicoDeConsumo: [
        3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597,
      ],
      modalidadeTarifaria: 'convencional',
      tipoDeConexao: 'bifasico',
    });

    expect(eligibilityResponse).toStrictEqual(mockResponse);
    expect(eligibilityResponse).toBeInstanceOf(ValidateEligibilityResponseDTO);
  });

  it('should return an ineligible response', async () => {
    const mockResponse = new ValidateEligibilityResponseDTO({
      elegivel: false,
      razoesDeInelegibilidade: [
        'Classe de consumo não aceita',
        'Modalidade tarifária não aceita',
        'Consumo muito baixo para tipo de conexão',
      ],
    });

    const eligibilityResponse = validateEligibilityService.execute({
      numeroDoDocumento: '14041737706',
      tipoDeConexao: 'bifasico',
      classeDeConsumo: 'rural',
      modalidadeTarifaria: 'verde',
      historicoDeConsumo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    });

    expect(eligibilityResponse).toStrictEqual(mockResponse);
  });

  it('should return an eligible response with monophase connection 400+', async () => {
    const mockResponse = new ValidateEligibilityResponseDTO({
      elegivel: true,
      economiaAnualDeCO2: 403.2,
    });

    const eligibilityResponse = validateEligibilityService.execute({
      numeroDoDocumento: '14041737706',
      classeDeConsumo: 'comercial',
      historicoDeConsumo: [
        400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400,
      ],
      modalidadeTarifaria: 'convencional',
      tipoDeConexao: 'monofasico',
    });

    expect(eligibilityResponse).toStrictEqual(mockResponse);
  });

  it('should return an eligible response with threepase connection 750+', async () => {
    const mockResponse = new ValidateEligibilityResponseDTO({
      elegivel: true,
      economiaAnualDeCO2: 756,
    });

    const eligibilityResponse = validateEligibilityService.execute({
      numeroDoDocumento: '40247332000190',
      classeDeConsumo: 'comercial',
      historicoDeConsumo: [
        750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750,
      ],
      modalidadeTarifaria: 'convencional',
      tipoDeConexao: 'trifasico',
    });

    expect(eligibilityResponse).toStrictEqual(mockResponse);
  });
});
