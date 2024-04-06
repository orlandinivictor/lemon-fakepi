interface IValidateEligibilityResponse {
  elegivel: boolean;
  economiaAnualDeCO2?: number;
  razoesDeInelegibilidade?: string[];
}

export class ValidateEligibilityResponseDTO {
  elegivel: boolean;
  economiaAnualDeCO2?: number;
  razoesDeInelegibilidade?: string[];

  constructor(responseParams: IValidateEligibilityResponse) {
    this.elegivel = responseParams.elegivel;

    if (responseParams.economiaAnualDeCO2)
      this.economiaAnualDeCO2 = responseParams.economiaAnualDeCO2;
    if (responseParams.razoesDeInelegibilidade)
      this.razoesDeInelegibilidade = responseParams.razoesDeInelegibilidade;
  }
}
