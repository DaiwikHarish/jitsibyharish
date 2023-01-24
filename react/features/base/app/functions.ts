import moment from 'moment';
import { toState } from '../redux/functions';

import { IStateful, YYYY_MM_DD_T_HH_MM_SS } from './types';

/**
 * Gets the value of a specific React {@code Component} prop of the currently
 * mounted {@link App}.
 *
 * @param {IStateful} stateful - The redux store or {@code getState}
 * function.
 * @param {string} propName - The name of the React {@code Component} prop of
 * the currently mounted {@code App} to get.
 * @returns {*} The value of the specified React {@code Component} prop of the
 * currently mounted {@code App}.
 */
export function getAppProp(stateful: IStateful, propName: string) {
    const state = toState(stateful)['features/base/app'];

    if (state) {
        const { app } = state;

        if (app) {
            return app.props[propName];
        }
    }

    return undefined;
}


///// common date convertion methods 

// yyyy-mm-ddTHH:mm:ss (From UI local - API UTC time)
  export function localToUTC(dateString: string): string {
    let momentDate = moment(dateString, YYYY_MM_DD_T_HH_MM_SS).utc();
    return momentDate.format(YYYY_MM_DD_T_HH_MM_SS);
  }

  // yyyy-mm-ddTHH:mm:ss (From API UTC - local UI )
 export function utcToLocal(dateString: string): string {
    if (dateString.includes('.')) {
      dateString = dateString.split('.')[0];
    }

    let date = new Date(dateString);
    const milliseconds = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    const localTime = new Date(milliseconds);

    let momentDate = moment(localTime);

    return momentDate.format(YYYY_MM_DD_T_HH_MM_SS);
  }

