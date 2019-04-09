import WalkerManager from '../managers/Walker';
import IPosition from '../models/IPosition';

export default class TremauxAlgorithm {
  private walker: WalkerManager;
  private direction: number;
  public end: IPosition;

  constructor(walker: WalkerManager) {
    this.walker = walker;
    this.direction = 0;
    this.end = this.walker.mazeSpecs.end;
  }

  public solve() {
    // Draw solution path.
    for (let x = 0; x < this.walker.mazeSpecs.width; x++) {
      for (let y = 0; y < this.walker.mazeSpecs.height; y++) {
        if (this.walker.visited[x][y] === 1) {
          this.walker.context.fillStyle = 'red';
          this.walker.context.fillRect(x * 10, y * 10, 10, 10);
        }
      }
    }
  }

  public step(backtrack = false) {
    const startingDirection = this.direction;

    while (!this.walker.move(this.direction, backtrack)) {
      // Hit a wall. Turn to the right.
      this.direction++;

      if (this.direction > 3) {
        this.direction = 0;
      }

      if (this.direction === startingDirection) {
        // We've turned in a complete circle with no new path available. Time to backtrack.
        this.step(true);

        return;
      }
    }

    this.walker.draw();
  }

  public isDone() {
    return (
      this.walker.x === this.walker.mazeSpecs.end.x &&
      this.walker.y === this.walker.mazeSpecs.end.y
    );
  }
}
