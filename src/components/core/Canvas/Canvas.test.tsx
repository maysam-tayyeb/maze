import { mount } from 'enzyme';
import * as React from 'react';

import Canvas, { ICanvasProps } from './Canvas';

const canvasProps: ICanvasProps = {
  height: 10,
  width: 10,
  contextRef: jest.fn()
};

describe('Canvas', () => {
  test('Renders successfully', () => {
    const wrapper = mount(<Canvas {...canvasProps} />);

    expect(wrapper.exists('canvas')).toBeTruthy();
    expect(canvasProps.contextRef).toHaveBeenCalled();
  });
});
