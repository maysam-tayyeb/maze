import * as React from 'react';
import { Button, ButtonGroup, Jumbotron } from 'reactstrap';

import MazeSpecsAPI from '../../api/MazeSpecs';
import { isBlocked } from '../../common/utils/Maze';
import TremauxAlgorithm from '../../core/algorithms/Tremaux';
import WalkerManager from '../../core/managers/Walker';
import IMazeSpecs from '../../core/models/IMazeSpecs';
import Canvas from '../core/Canvas/Canvas';
import './Maze.scss';

enum MazeType {
  GIVEN = 'Given',
  SIZE_61x61 = '61x61'
}

interface IAppState {
  loading: boolean;
  solving: boolean;
  solved: boolean;
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
    solved: false,
    type: 'given'
  };

  private initializeMaze = () => {
    const { context, mazeSpecs } = this.state;
    if (!context || !mazeSpecs) {
      return;
    }

    this.drawMaze(false);
    this.walkerManager = new WalkerManager(context, mazeSpecs);
    this.walkerManager.init();

    this.algorithm = new TremauxAlgorithm(this.walkerManager);
    this.speed = mazeSpecs.speed;
  };

  private drawMaze = (drawClear: boolean) => {
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

  private fetchMaze = (type: string) => {
    const { solving, solved } = this.state;
    if (solving || solved || this.state.type === type) {
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

  private handleSituation = () => {
    const { solving, solved } = this.state;

    if (solving) {
      return;
    }

    if (!solved) {
      this.setState({ solving: true });
      this.solve();
    } else {
      this.drawMaze(true);

      this.setState({ solved: false });
      this.initializeMaze();
    }
  };

  private solve = () => {
    if (!this.algorithm.isDone()) {
      this.algorithm.step();

      window.setTimeout(() => {
        this.solve();
      }, this.speed);
    } else {
      this.drawMaze(true);

      this.algorithm.solve();
      this.setState({ solving: false, solved: true });
    }
  };

  public saveContext = (context: CanvasRenderingContext2D) => {
    this.setState({
      context
    });
  };

  public componentDidMount(): void {
    this.fetchMaze(MazeType.GIVEN);
  }

  public componentDidUpdate(): void {
    this.initializeMaze();
  }

  public render() {
    const { loading, solving, solved, mazeSpecs } = this.state;

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
                      className={solving || solved ? 'disabled' : ''}
                      onClick={() => this.fetchMaze(MazeType.GIVEN)}
                    >
                      Given
                    </Button>
                    <Button
                      ta-id="61x61-button"
                      className={solving || solved ? 'disabled' : ''}
                      onClick={() => this.fetchMaze(MazeType.SIZE_61x61)}
                    >
                      61x61
                    </Button>
                  </ButtonGroup>
                  <Button
                    onClick={this.handleSituation}
                    className={solving ? 'disabled' : ''}
                    color="primary"
                    ta-id="go-button"
                  >
                    {solving ? 'Solving...' : solved ? 'Reset' : 'Go!'}
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
