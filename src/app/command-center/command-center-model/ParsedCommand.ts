import {Rover} from './Rover';

export class ParsedCommand {
  selectedRover: Rover;
  roverInstructions: string;
  finalRoverStatus: Rover;

  constructor(selectedRover: Rover, roverInstructions: string, finalRoverStatus: Rover) {
    this.selectedRover = selectedRover;
    this.roverInstructions = roverInstructions;
    this.finalRoverStatus = finalRoverStatus;
  }
}
