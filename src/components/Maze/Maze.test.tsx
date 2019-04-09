import { mount } from 'enzyme';
import * as React from 'react';

import MazeSpecsAPI from '../../api/MazeSpecs';
import { mazeSpecs } from '../../common/utils/Maze.test';
import Maze from './Maze';

MazeSpecsAPI.getGivenSpecs = jest.fn(() => Promise.resolve(mazeSpecs));

describe('Maze', () => {
  const wrapper = mount(<Maze />);

  test('Renders the maze', done => {
    expect(wrapper.state('loading')).toBeFalsy();
    expect(wrapper.exists()).toBeTruthy();
    wrapper.update();
    expect(wrapper.state('loading')).toBeFalsy();
    wrapper.find('button[ta-id="go-button"]').simulate('click');
    wrapper.update();

    setTimeout(() => {
      wrapper.update();

      done();
    }, 500);
  });
});
