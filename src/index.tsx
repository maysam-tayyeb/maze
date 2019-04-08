import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'normalize.css/normalize.css';
import './components/MazeApp';
import MazeApp from './components/MazeApp';
import './styles/styles.scss';

const appEl = document.getElementById('app');

if (appEl) {
  ReactDOM.render(<MazeApp />, appEl);
}
