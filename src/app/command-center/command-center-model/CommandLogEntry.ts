import {ParsedCommand} from './ParsedCommand';

export class CommandLogEntry {
  processed: ParsedCommand[];
  raw: string;

  constructor(processed: ParsedCommand[], raw: string) {
    this.processed = processed;
    this.raw = raw;
  }
}
