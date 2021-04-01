import {Component, OnInit} from '@angular/core';
import {ParsedCommand} from './command-center-model/ParsedCommand';
import {CommandSenderValidationResult} from './command-center-model/CommandSenderValidationResult';
import {StandardValidationResult} from './command-center-model/StandardValidationResult';
import {Rover} from './command-center-model/Rover';
import {SnackbarComponent} from '../snackbar/snackbar.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-command-center',
  templateUrl: './command-center.component.html',
  styleUrls: ['./command-center.component.css']
})
export class CommandCenterComponent implements OnInit {

  /**
   * string representing the user's desired commands
   */
  commandsInput: string;
  /**
   * array that shows the desired commands and the results of the execution
   */
  parsedCommands: ParsedCommand[] = [];
  /**
   * this is where the plateau size is stored
   */
  public topRightCoordinates = null;
  /**
   * Regular expression that represents a rover
   */
  roverFaceRegExp = new RegExp('([0-9] [0-9] [NESW])');
  /**
   * Regular expression that represents commands for rovers
   */
  roverMovementRegExp = new RegExp('([LMR])');
  /**
   * Regular expression that represents coordinates (used to extract plateau size from user's input)
   */
  plateauSizeRegExp = new RegExp('([0-9] [0-9])');

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  /**
   * Validates that the raw string of commands (rawCommands) are valid commands
   * @param rawCommands the raw string of commands typed by the user
   */
  validate(rawCommands: string): CommandSenderValidationResult {

    /* Extract the lines from the raw string to generate an array called lines */
    const lines = this.getCommandLinesFromRawString(rawCommands);

    /* Make sure the array has a valid length */
    const lengthValidationResult = this.validateLength(lines);

    /* Initialize content validation as wrong */
    let recognizedCommandsResult = new StandardValidationResult('', false);
    if (lengthValidationResult.result) {
      /* Make sure the array has a valid content */
      recognizedCommandsResult = this.validateContentOfCommands(lines);
      if (!recognizedCommandsResult.result) {
        /* If there is an error, we show it to the user */
        this.showModal(recognizedCommandsResult.message, 'error');
      }
    } else {
      /* If there is an error, we show it to the user */
      this.showModal(lengthValidationResult.message, 'error');
    }

    /* Finally, return the results */
    return new CommandSenderValidationResult(recognizedCommandsResult, lengthValidationResult);
  }

  /**
   * Validates the raw string of commands (rawCommands) and processes the data if valid
   * @param rawCommands the raw string of commands typed by the user
   */
  validateAndSubmitCommands(rawCommands: string): void {

    this.parsedCommands = [];

    /* We first validate the raw string of commands */
    const validationResult = this.validate(rawCommands);

    /* Depending on the validations, we proceed */
    if (validationResult.lengthValidationResult.result && validationResult.recognizedCommandsResult.result) {

      /* We first extract the lines from the raw string */
      const lines = this.getCommandLinesFromRawString(rawCommands);

      /* Then we extract the data for the plateau size and erase it from the array */
      this.topRightCoordinates = this.getCommandsArrayFromLine(lines[0]);
      lines.splice(0, 1);

      /* Then we parse the commands */
      this.parsedCommands = this.parseCommandLines(lines);

      /* Finally, we execute the commands */
      this.executeCommands(this.parsedCommands);
    }
  }

  /**
   * Generates an array of Parsed Commands which is an object that has a rover and its instructions at each index
   * @See ParsedCommand
   * @param commandLines the array of raw commands
   */
  parseCommandLines(commandLines: string[]): ParsedCommand[] {
    const parsedCommands = [];
    /* Iterate thro the array */
    for (let i = 0; i < commandLines.length; i++) {
      /* Get the value at actual index */
      const line = commandLines[i];
      /* Validates content of index (whether is a rover or commands for a rover) */
      if (line && this.roverFaceRegExp.test(line)) {
        /* It is a rover */

        /* extract coordinates and direction of rover */
        const values = line.split(' ');
        const rover = new Rover(parseInt(values[0], 10), parseInt(values[1], 10), values[2]);
        /* store rover at the parsedCommands array, creating a different instance to show the result of the commands execution later */
        parsedCommands.push(new ParsedCommand(rover, '',
          new Rover(parseInt(values[0], 10), parseInt(values[1], 10), values[2])));
      } else if (line && this.roverMovementRegExp.test(line)) {
        /* Commands for rover from last index */

        /* Gets the index of the rover */
        const roverIndex = parsedCommands.length - 1;
        /* Stores the commands to the right rover */
        parsedCommands[roverIndex].roverInstructions = line;
      } else {
        /* There was an error, so it is better to stop parsing. (possible wrong commands) */
        this.showModal('Invalid entry at line ' + (i + 2), 'error');
        break;
      }
    }
    return parsedCommands;
  }

  /**
   * Execute Rovers instructions calling rotate or move according to the parsed commands
   * @param parsedCommands the commands to be executed
   */
  executeCommands(parsedCommands: ParsedCommand[]): void {
    parsedCommands.forEach(command => {
      const instructions = command.roverInstructions.split('');
      instructions.forEach(instruction => {
        if (instruction === 'L' || instruction === 'R') {
          command.finalRoverStatus.rotate(instruction);
        } else {
          command.finalRoverStatus.move(this.topRightCoordinates);
        }
      });
    });
  }

  /**
   * Extracts lines from an string, using line breaks as separator for each index
   * @param rawCommands the raw string of commands typed by the user
   */
  getCommandLinesFromRawString(rawCommands: string): string[] {
    return rawCommands.split(/\n/);
  }

  /**
   * Extracts each character of a valid rover position or plateau size
   * @param line the string of commands
   */
  getCommandsArrayFromLine(line: string): string[] {
    return line.split(' ');
  }

  /**
   * Validates that the length of the array of commands is valid.
   * @param lines the array to be validated
   */
  validateLength(lines: string[]): StandardValidationResult {
    const response = new StandardValidationResult('error', false);
    switch (this.countCommandLines(lines)) {
      case -1:
        response.message = 'Invalid length of commands';
        break;
      case 0 || 1:
        response.message = 'Insufficient command lines';
        break;
      default:
        response.message = 'OK';
        response.result = true;
        break;
    }
    return response;
  }

  /**
   * Validates thru Regular expressions, that the content of the commands are valid
   * @param lines the array with commands
   */
  validateContentOfCommands(lines: string[]): StandardValidationResult {
    const response = new StandardValidationResult('OK', true);
    lines.forEach(line => {
      if (!this.roverFaceRegExp.test(line) && !this.plateauSizeRegExp.test(line) && !this.roverMovementRegExp.test(line)) {
        response.result = false;
        response.message = 'Invalid commands';
      }
    });
    return response;
  }

  /**
   * Validates that the array is !undefined and !null and returns the length of it
   * @param linesToCheck the array to be validated
   */
  countCommandLines(linesToCheck: string[]): number {
    if (!linesToCheck) {
      return -1;
    } else {
      return linesToCheck.length;
    }
  }

  /**
   * Opens a generic snackbar with desired message
   * @param message shown
   * @param type of snackbar
   */
  showModal(message: string, type: string): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 10 * 1000,
    });
    snackBarRef.instance.type = type;
    snackBarRef.instance.message = message;
  }

}
