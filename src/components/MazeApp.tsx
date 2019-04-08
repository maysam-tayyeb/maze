import * as React from 'react';

import './MazeApp.scss';

interface IAppState {
  isLoading: boolean;
}

export default class MazeApp extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  public render() {
    return <p>Initial App</p>;
  }
}
