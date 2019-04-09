import IPoint from '../models/IPoint';

export default class WalkerManager {
  private context: any;
  private maze: any;
  private x: number;
  private y: number;
  private lastX: number;
  private lastY: number;
  private visited: number[];

  constructor(context: any, maze: any) {
    this.context = context;
    this.maze = maze;
    this.x = this.maze.start.x;
    this.y = this.maze.start.y;
    this.lastX = -1;
    this.lastY = -1;
    this.visited = createArray(this.maze.width, this.maze.height);
  }

  public canMove(x: number, y: number) {
    return this.maze.isOpen(x, y) && this.visited[x][y] < 2;
  }

  public init() {
    // Clear array to all zeros.
    for (let x = 0; x < this.maze.width; x++) {
      for (let y = 0; y < this.maze.height; y++) {
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
      this.context.fillStyle = 'rgb(' + (backtrack ? 100 : 255) + ', 0, 0)';
      this.context.fillRect(oldX * 10, oldY * 10, 10, 10);

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
        // Found an unwalked tile while backtracking. Mark our last tile back to 1 so we can visit it again to exit this path.
        this.visited[oldX][oldY] = 1;
        this.context.fillStyle = 'rgb(255, 0, 0)';
        this.context.fillRect(oldX * 10, oldY * 10, 10, 10);
      }
    }

    return changed;
  }

  public getXYForDirection(direction: number) {
    const point: IPoint = { x: 0, y: 0 };

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
    this.context.fillStyle = 'rgb(255, 100, 100)';
    this.context.fillRect(this.x * 10, this.y * 10, 10, 10);
  }
}

function createArray(...lengths: number[]) {
  const arr = new Array(lengths[0] || 0);
  let i = lengths.length;

  if (lengths.length > 1) {
    const args = Array.prototype.slice.call(lengths, 1);
    while (i--) {
      arr[length - 1 - i] = createArray.apply(undefined, args);
    }
  }

  return arr;
}
