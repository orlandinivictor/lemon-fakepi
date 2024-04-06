import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import {
  classesDeConsumo,
  modalidadesTarifarias,
  tiposDeConexao,
} from '@src/modules/eligibility/eligibility.enum';

export class ValidateEligibilityDTO {
  @IsString()
  @IsNotEmpty()
  numeroDoDocumento: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(tiposDeConexao))
  tipoDeConexao: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(classesDeConsumo))
  classeDeConsumo: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(modalidadesTarifarias))
  modalidadeTarifaria: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(12)
  @ArrayMaxSize(12)
  historicoDeConsumo: number[];
}
