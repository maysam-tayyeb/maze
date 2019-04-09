import * as React from 'react';
import { Button, ButtonGroup, Jumbotron } from 'reactstrap';

import MazeSpecsAPI from '../../api/MazeSpecs';
import { isBlocked } from '../../common/utils/Maze';
import TremauxAlgorithm from '../../core/algorithms/Tremaux';
import WalkerManager from '../../core/managers/Walker';
import IMazeSpecs from '../../core/models/IMazeSpecs';
import Canvas from '../core/Canvas/Canvas';
import './Maze.scss';

interface IAppState {
  loading: boolean;
  solving: boolean;
  mazeSpecs?: IMazeSpecs;
  context?: CanvasRenderingContext2D;
  type: string;
}

export default class Maze extends React.Component<{}, IAppState> {
  private algorithm: TremauxAlgorithm;
  private speed: number;
  private walkerManager: WalkerManager;
  public state: Readonly<IAppState> = {
    loading: true,
    solving: false,
    type: 'given'
  };

  public saveContext = (context: CanvasRenderingContext2D) => {
    this.setState({
      context
    });
  };

  public drawMaze = (drawClear: boolean) => {
    const context = this.state.context!;
    const mazeSpecs = this.state.mazeSpecs!;
    const { width, height } = mazeSpecs;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (isBlocked(mazeSpecs, x, y)) {
          context.fillStyle = 'black';
          context.fillRect(x * 10, y * 10, 10, 10);
        } else if (drawClear) {
          context.fillStyle = 'white';
          context.fillRect(x * 10, y * 10, 10, 10);
        }
      }
    }
  };

  public fetchMaze = (type: string) => {
    if (this.state.type === type) {
      return;
    }

    this.setState({
      loading: true,
      type
    });

    MazeSpecsAPI[`get${type}Specs`]().then((mazeSpecs: IMazeSpecs) =>
      this.setState({
        loading: false,
        mazeSpecs
      })
    );
  };

  public solve = () => {
    if (!this.algorithm.isDone()) {
      this.algorithm.step();

      window.setTimeout(() => {
        this.solve();
      }, this.speed);
    } else {
      this.drawMaze(true);

      this.algorithm.solve();
    }
  };

  public componentDidMount(): void {
    MazeSpecsAPI.getGivenSpecs().then(mazeSpecs =>
      this.setState({
        loading: false,
        mazeSpecs
      })
    );
  }

  public componentDidUpdate(): void {
    const { context, mazeSpecs } = this.state;
    if (!context || !mazeSpecs) {
      return;
    }

    this.drawMaze(false);
    this.walkerManager = new WalkerManager(context, mazeSpecs);
    this.walkerManager.init();
    this.algorithm = new TremauxAlgorithm(this.walkerManager);
    this.speed = mazeSpecs.speed;
  }

  public render() {
    const { loading, mazeSpecs } = this.state;

    return (
      <>
        {loading ? (
          <span>...Loading</span>
        ) : (
          mazeSpecs && (
            <div className="container">
              <Jumbotron>
                <div className="d-flex justify-content-center">
                  <h3 className="maze__title">
                    Maze solver using Temuax algorithm
                  </h3>
                </div>
                <div className="d-flex justify-content-center maze__canvas-container">
                  <Canvas
                    contextRef={this.saveContext}
                    width={mazeSpecs.width}
                    height={mazeSpecs.height}
                  />
                </div>

                <div className="d-flex justify-content-center">
                  <ButtonGroup color="" className="mr-2">
                    <Button
                      ta-id="given-button"
                      onClick={() => this.fetchMaze('Given')}
                    >
                      Given
                    </Button>
                    <Button
                      ta-id="61x61-button"
                      onClick={() => this.fetchMaze('61x61')}
                    >
                      61x61
                    </Button>
                  </ButtonGroup>
                  <Button
                    onClick={this.solve}
                    color="primary"
                    ta-id="go-button"
                  >
                    Go!
                  </Button>
                </div>
              </Jumbotron>
            </div>
          )
        )}
      </>
    );
  }
}
