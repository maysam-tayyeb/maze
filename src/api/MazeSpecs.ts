import Axios from 'axios';

import IMazeSpecs from '../core/models/IMazeSpecs';

export default class MazeSpecsAPI {
  public static getGivenSpecs(): Promise<IMazeSpecs> {
    return Axios.get('specs/givenMazeSpecs.json').then(response => {
      return response.data;
    });
  }

  public static get61x61Specs(): Promise<IMazeSpecs> {
    return Axios.get('specs/61x61MazeSpecs.json').then(response => {
      return response.data;
    });
  }
}
