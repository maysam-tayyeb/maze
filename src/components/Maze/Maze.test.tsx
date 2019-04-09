import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { mazeSpecs } from '../../common/utils/Maze.test';
import Maze from './Maze';

describe('Maze', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(Axios);
    mock.onGet('specs/givenMazeSpecs.json').reply(200, mazeSpecs);
    mock.onGet('specs/61x61MazeSpecs.json').reply(200, mazeSpecs);
  });

  afterEach(() => {
    mock.restore();
  });

  test('Renders the maze', () => {
    const wrapper = shallow(<Maze />);

    expect(wrapper.state('loading')).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });

  test('Renders the maze', done => {
    const wrapper = mount(<Maze />);

    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('button[ta-id="go-button"]').text()).toBe('Go!');
      expect(wrapper.state('solving')).toBeFalsy();
      expect(wrapper.state('solved')).toBeFalsy();

      wrapper.find('button[ta-id="go-button"]').simulate('click');

      expect(wrapper.find('button[ta-id="go-button"]').text()).toBe(
        'Solving...'
      );
      wrapper.find('button[ta-id="go-button"]').simulate('click');
      wrapper.update();
      expect(
        wrapper.find('button[ta-id="go-button"]').hasClass('disabled')
      ).toBeTruthy();
      expect(
        wrapper.find('button[ta-id="given-button"]').hasClass('disabled')
      ).toBeTruthy();
      expect(
        wrapper.find('button[ta-id="61x61-button"]').hasClass('disabled')
      ).toBeTruthy();
      wrapper.find('button[ta-id="given-button"]').simulate('click');
      wrapper.find('button[ta-id="61x61-button"]').simulate('click');
      wrapper.update();
      expect(wrapper.state('solving')).toBeTruthy();
      expect(wrapper.state('solved')).toBeFalsy();

      setTimeout(() => {
        wrapper.update();
        expect(wrapper.find('button[ta-id="go-button"]').text()).toBe('Reset');
        expect(
          wrapper.find('button[ta-id="go-button"]').hasClass('disabled')
        ).toBeFalsy();
        expect(
          wrapper.find('button[ta-id="given-button"]').hasClass('disabled')
        ).toBeTruthy();
        expect(
          wrapper.find('button[ta-id="61x61-button"]').hasClass('disabled')
        ).toBeTruthy();
        expect(wrapper.state('solving')).toBeFalsy();
        expect(wrapper.state('solved')).toBeTruthy();

        wrapper.find('button[ta-id="go-button"]').simulate('click');
        wrapper.update();
        expect(wrapper.state('solving')).toBeFalsy();
        expect(wrapper.state('solved')).toBeFalsy();

        done();
      }, 500);
    }, 500);
  }, 50000);
});
