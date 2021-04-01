import {CommandCenterConstants} from '../command-center-utils/command-center-constants';

export class Rover {
  face: string;
  xAxis: number;
  yAxis: number;

  constructor(xAxis: number, yAxis: number, face: string) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.face = face;
  }

  rotate(command: string): Rover {
    let angle = 0;
    switch (command) {
      case 'L':
        angle = -90;
        break;
      case 'R':
        angle = 90;
        break;
      default:
        break;
    }

    const finalDegrees = CommandCenterConstants.cardinalesToDegreesMap.get(this.face) + angle;
    this.face = CommandCenterConstants.degreesToCardinalesMap.get(finalDegrees.toString());
    return this;
  }

  move(plateauSize: number[]): Rover {
    switch (this.face) {
      case 'N':
        this.yAxis = this.yAxis + 1 > plateauSize[1] ? plateauSize[1] : this.yAxis + 1;
        break;
      case 'E':
        this.xAxis = this.xAxis + 1 > plateauSize[0] ? plateauSize[0] : this.xAxis + 1;
        break;
      case 'S':
        this.yAxis = this.yAxis - 1 < 0 ? 0 : this.yAxis - 1;
        break;
      case 'W':
        this.xAxis = this.xAxis - 1 < 0 ? 0 : this.xAxis - 1;
        break;
      default:
        break;
    }
    return this;
  }

  toString(): string {
    return this.xAxis + ',' + this.yAxis + ' ' + this.face;
  }
}
