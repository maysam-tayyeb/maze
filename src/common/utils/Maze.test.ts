import IMazeSpecs from '../../core/models/IMazeSpecs';
import { isBlocked, isOpen } from './Maze';

export const mazeSpecs: IMazeSpecs = {
  start: { x: 0, y: 1 },
  end: { x: 10, y: 9 },
  width: 11,
  height: 11,
  speed: 1,
  map:
    '###########  #   #   ## # # # # ##   #   # ########## ## #       ## # ######## #   #   ## # # ### ##   #      ###########'
};

describe('Maze Utils', () => {
  it('creates arrays', () => {
    let open: boolean;

    open = isOpen(mazeSpecs, 0, 0);
    expect(open).toBeFalsy();
    open = isOpen(mazeSpecs, 3, 2);
    expect(open).toBeTruthy();
  });
  it('creates arrays', () => {
    let blocked: boolean;

    blocked = isBlocked(mazeSpecs, 0, 0);
    expect(blocked).toBeTruthy();
    blocked = isBlocked(mazeSpecs, 3, 2);
    expect(blocked).toBeFalsy();
  });
});
