import IMazeSpecs from '../../core/models/IMazeSpecs';

export const isOpen = (
  mazeSpecs: IMazeSpecs,
  x: number,
  y: number
): boolean => {
  const { width, map } = mazeSpecs;

  return x < 0 || y < 0 || map[x + y * width] === ' ';
};

export const isBlocked = (
  mazeSpecs: IMazeSpecs,
  x: number,
  y: number
): boolean => {
  return !isOpen(mazeSpecs, x, y);
};
