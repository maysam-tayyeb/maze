import Axios from 'axios';

import IMazeSpecs from '../core/models/IMazeSpecs';

export default class MazeSpecProviderAPI {
  public static getSpecs(): Promise<IMazeSpecs> {
    return Axios.get('static/mazeSpecs.json').then(response => {
      return response.data;
    });
  }
}
