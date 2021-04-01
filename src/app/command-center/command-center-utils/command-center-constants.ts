export class CommandCenterConstants {
  /**
   * Map used for rovers rotation
   */
  public static cardinalesToDegreesMap = new Map([['N', 0], ['E', 90], ['S', 180], ['W', 270]]);
  /**
   * Map used for rovers rotation
   */
  public static degreesToCardinalesMap = new Map([['0', 'N'], ['360', 'N'], ['90', 'E'], ['180', 'S'], ['270', 'W'], ['-90', 'W']]);
}
