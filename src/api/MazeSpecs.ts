import Axios from 'axios';

import IMazeSpecs from '../core/models/IMazeSpecs';

export default class MazeSpecsAPI {
  public static get11x11Specs(): Promise<IMazeSpecs> {
    return Axios.get('specs/11x11.json').then(response => {
      return response.data;
    });
  }

  public static get61x61Specs(): Promise<IMazeSpecs> {
    return Axios.get('specs/61x61.json').then(response => {
      return response.data;
    });
  }
}
