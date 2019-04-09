import * as React from 'react';

import MazeSpecProvider from '../../api/MazeSpecProvider';
import IMazeSpecs from '../../core/models/IMazeSpecs';
import Maze from '../core/Maze/Maze';
import './MazeApp.scss';

interface IAppState {
  loading: boolean;
  mazeSpecs?: IMazeSpecs;
  context?: CanvasRenderingContext2D;
}

export default class MazeApp extends React.Component<{}, IAppState> {
  public state: Readonly<IAppState> = {
    loading: true
  };

  public saveContext = (context: CanvasRenderingContext2D) => {
    this.setState({
      context
    });
  };

  public draw = (drawClear: boolean) => {
    const context = this.state.context!;
    const { width, height } = this.state.mazeSpecs!;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (this.isWall(x, y)) {
          context.fillStyle = 'black';
          context.fillRect(x * 10, y * 10, 10, 10);
        } else if (drawClear) {
          context.fillStyle = 'white';
          context.fillRect(x * 10, y * 10, 10, 10);
        }
      }
    }
  };

  public componentDidMount(): void {
    MazeSpecProvider.getSpecs().then(mazeSpecs =>
      this.setState({
        loading: false,
        mazeSpecs
      })
    );
  }

  public componentDidUpdate(): void {
    if (this.state.context) {
      this.draw(false);
    }
  }

  public isWall = (x: number, y: number) => {
    const { width, map } = this.state.mazeSpecs!;

    return x < 0 || y < 0 || map[x + y * width] === '*';
  };

  public render() {
    const { loading, mazeSpecs } = this.state;

    return loading ? (
      <span>...Loading</span>
    ) : (
      mazeSpecs && (
        <Maze
          contextRef={this.saveContext}
          shouldUpdateSize={false}
          width={mazeSpecs.width}
          height={mazeSpecs.height}
        />
      )
    );
  }
}
