import { BadRequestException, Injectable } from '@nestjs/common';

import { ValidateEligibilityResponseDTO } from '@src/modules/eligibility/dtos/ValidateEligibilityResponse.dto';
import { ValidateEligibilityDTO } from '@src/modules/eligibility/dtos/ValidateEligibility.dto';
import {
  classesDeConsumo,
  modalidadesTarifarias,
  tiposDeConexao,
} from '@src/modules/eligibility/eligibility.enum';
import { requiredFields } from '@src/modules/eligibility/eligibility.constants';

@Injectable()
export class ValidateEligibilityService {
  execute(
    eligibilityParams: ValidateEligibilityDTO,
  ): ValidateEligibilityResponseDTO {
    this.validateFields(eligibilityParams);

    const {
      classeDeConsumo,
      historicoDeConsumo,
      modalidadeTarifaria,
      numeroDoDocumento,
      tipoDeConexao,
    } = eligibilityParams;

    const formattedNumeroDoDocumento = numeroDoDocumento
      .replaceAll('.', '')
      .replaceAll('-', '')
      .replaceAll('/', '');

    this.validateDocument(formattedNumeroDoDocumento);
    const consumptionHistory = this.validateHistory(historicoDeConsumo);

    const reprovalReasons = [
      this.validateConsumptionClass(classeDeConsumo),
      this.validateFareModality(modalidadeTarifaria),
      this.validatePowerConsumption(consumptionHistory, tipoDeConexao),
    ].filter(Boolean);

    const responseObject = {
      elegivel: !Boolean(reprovalReasons.length),
    };

    if (reprovalReasons.length) {
      Object.assign(responseObject, {
        razoesDeInelegibilidade: reprovalReasons,
      });
    } else {
      const annualSaving = this.calculateAnnualSaving(consumptionHistory);
      Object.assign(responseObject, {
        economiaAnualDeCO2: annualSaving,
      });
    }

    return new ValidateEligibilityResponseDTO(responseObject);
  }

  private validateDocument(document: string): void {
    if (new RegExp('^\\d{11}$').test(document)) return;
    if (new RegExp('^\\d{14}$').test(document)) return;

    throw new BadRequestException(
      'Documento inválido, por favor informe apenas os números do CPF ou CNPJ',
    );
  }

  private validateHistory(history: number[]): number[] {
    const formattedHistory = history.map(Number);

    if (formattedHistory.some((value) => isNaN(value)))
      throw new BadRequestException(
        'Todos os valores do histórico de consumo devem ser números',
      );

    if (formattedHistory.length !== 12)
      throw new BadRequestException(
        'Você deve informar o histórico de consumo dos últimos 12 meses',
      );

    return formattedHistory;
  }

  private validateConsumptionClass(classConsumption: string): string | null {
    const validClasses: string[] = [
      classesDeConsumo.comercial,
      classesDeConsumo.residencial,
      classesDeConsumo.industrial,
    ];
    const isValidClass = validClasses.includes(classConsumption);

    return isValidClass ? null : 'Classe de consumo não aceita';
  }

  private validateFareModality(fareModality: string): string | null {
    const validModalitites: string[] = [
      modalidadesTarifarias.convencional,
      modalidadesTarifarias.branca,
    ];
    const isValidModality = validModalitites.includes(fareModality);

    return isValidModality ? null : 'Modalidade tarifária não aceita';
  }

  private validatePowerConsumption(
    consumptionHistory: number[],
    connectionType: string,
  ): string | null {
    const averageConsumption =
      this.calculateAverageConsumption(consumptionHistory);

    let isEligible = false;
    switch (connectionType) {
      case tiposDeConexao.monofasico:
        isEligible = averageConsumption >= 400;
        break;
      case tiposDeConexao.bifasico:
        isEligible = averageConsumption >= 500;
        break;
      case tiposDeConexao.trifasico:
        isEligible = averageConsumption >= 750;
        break;
    }

    return isEligible ? null : 'Consumo muito baixo para tipo de conexão';
  }

  private calculateAverageConsumption(consumptionHistory: number[]): number {
    const consumptionSum = consumptionHistory.reduce(
      (acc, value) => acc + value,
      0,
    );

    return consumptionSum / consumptionHistory.length;
  }

  private calculateAnnualSaving(consumptionHistory: number[]): number {
    const consumptionSum = consumptionHistory.reduce(
      (acc, value) => acc + value,
      0,
    );

    return (consumptionSum * 84) / 1000;
  }

  private validateFields(sentFields: ValidateEligibilityDTO): void {
    const missingFields = Object.entries(requiredFields)
      .map(([fieldName, fieldDescription]) => {
        if (typeof sentFields[fieldName] === 'undefined')
          return fieldDescription;

        return null;
      })
      .filter(Boolean);

    if (missingFields.length)
      throw new BadRequestException(
        `${missingFields.join(', ')} não informado(s)`,
      );
  }
}
