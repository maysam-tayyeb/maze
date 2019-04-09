import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.scss';

import Maze from './components/Maze/Maze';

const appEl = document.getElementById('app');

if (appEl) {
  ReactDOM.render(<Maze />, appEl);
}
