export class StandardValidationResult {
  message: string;
  result: boolean;

  constructor(status: string, result: boolean) {
    this.message = status;
    this.result = result;
  }

}
