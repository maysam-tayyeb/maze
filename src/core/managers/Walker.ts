import { createArray } from '../../common/utils/Array';
import { fillTile } from '../../common/utils/Canvas';
import { isOpen } from '../../common/utils/Maze';
import IMazeSpecs from '../models/IMazeSpecs';
import IPosition from '../models/IPosition';

export default class WalkerManager {
  private lastX: number;
  private lastY: number;
  public x: number;
  public y: number;
  public readonly visited: number[];
  public readonly context: CanvasRenderingContext2D;
  public readonly mazeSpecs: IMazeSpecs;

  private fillTile(color: number, x: number, y: number) {
    fillTile(this.context, `rgb(${color}, 0, 0)`, x, y);
  }

  constructor(context: CanvasRenderingContext2D, mazeSpecs: IMazeSpecs) {
    this.context = context;
    this.mazeSpecs = mazeSpecs;
    this.x = this.mazeSpecs.start.x;
    this.y = this.mazeSpecs.start.y;
    this.lastX = -1;
    this.lastY = -1;
    this.visited = createArray(this.mazeSpecs.width, this.mazeSpecs.height);
  }

  public canMove(x: number, y: number) {
    return isOpen(this.mazeSpecs, x, y) && this.visited[x][y] < 2;
  }

  public init() {
    // Clear array to all zeros.
    for (let x = 0; x < this.mazeSpecs.width; x++) {
      for (let y = 0; y < this.mazeSpecs.height; y++) {
        this.visited[x][y] = 0;
      }
    }

    // Set starting point.
    this.visited[this.x][this.y] = 1;

    // Draw starting point.
    this.draw();
  }

  public move(direction: number, backtrack: boolean) {
    let changed = false;
    const oldX = this.x;
    const oldY = this.y;

    if (backtrack || !this.hasVisited(direction)) {
      // Get the new x,y after moving.
      const point = this.getXYForDirection(direction);

      // Check if this is a valid move.
      if (this.canMove(point.x, point.y)) {
        this.x = point.x;
        this.y = point.y;
        changed = true;
      }
    }

    if (changed) {
      this.fillTile(backtrack ? 100 : 255, oldX, oldY);

      this.lastX = oldX;
      this.lastY = oldY;

      // Mark this tile as visited (possibly twice).
      this.visited[this.x][this.y]++;

      if (backtrack) {
        // We've turned around, so don't visit this last tile again.
        this.visited[this.lastX][this.lastY] = 2;
      }

      if (
        this.visited[oldX][oldY] === 2 &&
        this.visited[this.x][this.y] === 1
      ) {
        // Found an un-walked track while backtracking. Mark our last tile back to 1 so we can visit it again to exit this path.
        this.visited[oldX][oldY] = 1;
        this.fillTile(255, oldX, oldY);
      }
    }

    return changed;
  }

  public getXYForDirection(direction: number) {
    const point: IPosition = { x: 0, y: 0 };

    switch (direction) {
      case 0:
        point.x = this.x;
        point.y = this.y - 1;
        break;
      case 1:
        point.x = this.x + 1;
        point.y = this.y;
        break;
      case 2:
        point.x = this.x;
        point.y = this.y + 1;
        break;
      case 3:
        point.x = this.x - 1;
        point.y = this.y;
        break;
    }

    return point;
  }

  public hasVisited(direction: number) {
    // Get the new x,y after moving.
    const point = this.getXYForDirection(direction);

    // Check if this point has already been visited.
    return this.visited[point.x][point.y] > 0;
  }

  public draw() {
    this.fillTile(255, this.x, this.y);
  }
}
