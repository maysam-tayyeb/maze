import * as React from 'react';

export interface IPureCanvasProps {
  width: number;
  height: number;
  contextRef: (ctx: CanvasRenderingContext2D | null) => void;
  shouldUpdateSize: boolean;
}

export default class PureCanvas extends React.Component<IPureCanvasProps> {
  public shouldComponentUpdate() {
    return this.props.shouldUpdateSize;
  }

  public render() {
    const { width, height, contextRef } = this.props;
    return (
      <canvas
        width={width * 10}
        height={height * 10}
        ref={node => (node ? contextRef(node.getContext('2d')) : null)}
      />
    );
  }
}
