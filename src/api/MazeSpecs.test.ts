import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import MazeSpecsAPI from './MazeSpecs';

const mockSpecs = { width: 10, height: 10 };

describe('Maze Specs API', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(Axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('gets 11x11 specs', async () => {
    mock.onGet('specs/11x11.json').reply(200, mockSpecs);

    const mazeSpecs = await MazeSpecsAPI.get11x11Specs();

    expect(mazeSpecs).toEqual(mockSpecs);
  });

  it('gets 61x61 specs', async () => {
    mock.onGet('specs/61x61.json').reply(200, mockSpecs);

    const mazeSpecs = await MazeSpecsAPI.get61x61Specs();

    expect(mazeSpecs).toEqual(mockSpecs);
  });
});
