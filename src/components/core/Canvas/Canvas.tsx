import * as React from 'react';

export interface ICanvasProps {
  width: number;
  height: number;
  contextRef: (ctx: CanvasRenderingContext2D | null) => void;
}

export default class Canvas extends React.PureComponent<ICanvasProps> {
  public render() {
    const { width, height, contextRef } = this.props;
    return (
      <canvas
        width={width * 10}
        height={height * 10}
        ref={node => node && contextRef(node.getContext('2d'))}
      />
    );
  }
}
