import { shallow } from 'enzyme';
import * as React from 'react';

import MazeApp from './MazeApp';

const wrapper = shallow(<MazeApp />);
test('Shows Empty MazeApp', () => {
  expect(wrapper.exists()).toBeTruthy();
  expect(wrapper.find('p').text()).toBe('Initial App');
});
