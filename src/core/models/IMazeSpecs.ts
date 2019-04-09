import IPoint from './IPoint';

export default interface IMazeSpecs {
  width: number;
  height: number;
  start: IPoint;
  end: IPoint;
  speed: number;
  map: string[];
}
