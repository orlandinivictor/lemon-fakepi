import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { EligibilityModule } from '@src/modules/eligibility/eligibility.module';

describe('EligibilityController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EligibilityModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/eligibility (GET) Eligible', () => {
    const eligibilityMock = {
      elegivel: true,
      economiaAnualDeCO2: 5553.24,
    };

    return request(app.getHttpServer())
      .get(
        '/eligibility?historicoDeConsumo=3878&historicoDeConsumo=9760&historicoDeConsumo=5976&historicoDeConsumo=2797&historicoDeConsumo=2481&historicoDeConsumo=5731&historicoDeConsumo=7538&historicoDeConsumo=4392&historicoDeConsumo=7859&historicoDeConsumo=4160&historicoDeConsumo=6941&historicoDeConsumo=4597&numeroDoDocumento=14041737706&tipoDeConexao=bifasico&classeDeConsumo=comercial&modalidadeTarifaria=convencional',
      )
      .expect(200)
      .expect(eligibilityMock);
  });

  it('/eligibility (GET) Ineligible', () => {
    const ineligibilityMock = {
      elegivel: false,
      razoesDeInelegibilidade: [
        'Classe de consumo não aceita',
        'Modalidade tarifária não aceita',
      ],
    };

    return request(app.getHttpServer())
      .get(
        '/eligibility?historicoDeConsumo=3878&historicoDeConsumo=9760&historicoDeConsumo=5976&historicoDeConsumo=2797&historicoDeConsumo=2481&historicoDeConsumo=5731&historicoDeConsumo=7538&historicoDeConsumo=4392&historicoDeConsumo=7859&historicoDeConsumo=4160&numeroDoDocumento=14041737706&tipoDeConexao=bifasico&classeDeConsumo=rural&modalidadeTarifaria=verde&historicoDeConsumo=3000&historicoDeConsumo=4000',
      )
      .expect(200)
      .expect(ineligibilityMock);
  });

  it('/eligibility (GET) consumptionHistory BadRequest', () => {
    const ineligibilityMock = {
      message: 'Histórico de consumo não informado(s)',
      error: 'Bad Request',
      statusCode: 400,
    };

    return request(app.getHttpServer())
      .get(
        '/eligibility?numeroDoDocumento=14041737706&tipoDeConexao=bifasico&classeDeConsumo=rural&modalidadeTarifaria=verde',
      )
      .expect(400)
      .expect(ineligibilityMock);
  });

  it('/eligibility (GET) consumptionHistory, documentNumber BadRequest', () => {
    const ineligibilityMock = {
      message: 'Histórico de consumo, Número do documento não informado(s)',
      error: 'Bad Request',
      statusCode: 400,
    };

    return request(app.getHttpServer())
      .get(
        '/eligibility?tipoDeConexao=bifasico&classeDeConsumo=rural&modalidadeTarifaria=verde',
      )
      .expect(400)
      .expect(ineligibilityMock);
  });
});
