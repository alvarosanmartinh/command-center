import {StandardValidationResult} from './StandardValidationResult';

export class CommandSenderValidationResult {
  recognizedCommandsResult: StandardValidationResult;
  lengthValidationResult: StandardValidationResult;

  constructor(recognizedCommandsResult: StandardValidationResult, lengthValidationResult: StandardValidationResult) {
    this.lengthValidationResult = lengthValidationResult;
    this.recognizedCommandsResult = recognizedCommandsResult;
  }
}
