import ClassNames from 'classnames';
import * as React from 'react';
import { Button, ButtonGroup, Jumbotron } from 'reactstrap';

import MazeSpecsAPI from '../../api/MazeSpecs';
import { fillTile } from '../../common/utils/Canvas';
import { isBlocked } from '../../common/utils/Maze';
import TremauxAlgorithm from '../../core/algorithms/Tremaux';
import WalkerManager from '../../core/managers/Walker';
import IMazeSpecs from '../../core/models/IMazeSpecs';
import Canvas from '../core/Canvas/Canvas';
import './Maze.scss';

enum MazeType {
  SIZE_11x11 = '11x11',
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
    type: ''
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
          fillTile(context, 'black', x, y);
        } else if (drawClear) {
          fillTile(context, 'white', x, y);
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

  private getButtonClassNames = (mazeType: string) => {
    const { loading, solving, solved, type } = this.state;

    return ClassNames(
      (loading || solving || solved) && 'disabled',
      type === mazeType && 'active'
    );
  };

  public saveContext = (context: CanvasRenderingContext2D) => {
    this.setState({
      context
    });
  };

  public componentDidMount(): void {
    this.fetchMaze(MazeType.SIZE_11x11);
  }

  public componentDidUpdate(): void {
    this.initializeMaze();
  }

  public render() {
    const { loading, solving, solved, mazeSpecs, type } = this.state;
    const button11x11ClassNames = this.getButtonClassNames(MazeType.SIZE_11x11);
    const button61x61ClassNames = this.getButtonClassNames(MazeType.SIZE_61x61);

    return (
      <div className="container">
        <Jumbotron>
          <div className="d-flex">
            <h3 className="maze__title">Maze solver using Temuax algorithm</h3>
          </div>

          <div className="maze__button-bar d-flex">
            <ButtonGroup color="" className="mr-2">
              <Button
                data-test="11x11-button"
                className={button11x11ClassNames}
                onClick={() => this.fetchMaze(MazeType.SIZE_11x11)}
              >
                11x11
              </Button>
              <Button
                data-test="61x61-button"
                className={button61x61ClassNames}
                onClick={() => this.fetchMaze(MazeType.SIZE_61x61)}
              >
                61x61
              </Button>
            </ButtonGroup>
            <Button
              onClick={this.handleSituation}
              className={loading || solving ? 'disabled' : ''}
              color="primary"
              data-test="go-button"
            >
              {solving ? 'Solving...' : solved ? 'Reset' : 'Go!'}
            </Button>
          </div>

          <hr />

          {loading ? (
            <div className="maze__loading">Loading {type} specs...</div>
          ) : (
            mazeSpecs && (
              <div className="maze__canvas-container d-flex">
                <Canvas
                  contextRef={this.saveContext}
                  width={mazeSpecs.width}
                  height={mazeSpecs.height}
                />
              </div>
            )
          )}
        </Jumbotron>
      </div>
    );
  }
}
