import IPosition from './IPosition';

export default interface IMazeSpecs {
  width: number;
  height: number;
  start: IPosition;
  end: IPosition;
  speed: number;
  map: string;
}
