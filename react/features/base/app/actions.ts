import { IStore } from '../../app/types';

import { APP_CLIENT_TYPE, APP_WILL_MOUNT, APP_WILL_UNMOUNT } from './actionTypes';

/**
 * Signals that a specific App will mount (in the terms of React).
 *
 * @param {App} app - The App which will mount.
 * @returns {{
 *     type: APP_WILL_MOUNT,
 *     app: App
 * }}
 */
export function appWillMount(app: Object) {
    return (dispatch: IStore['dispatch']) => {
        // TODO There was a redux action creator appInit which I did not like
        // because we already had the redux action creator appWillMount and,
        // respectively, the redux action APP_WILL_MOUNT. So I set out to remove
        // appInit and managed to move everything it was doing but the
        // following. Which is not extremely bad because we haven't moved the
        // API module into its own feature yet so we're bound to work on that in
        // the future.
        typeof APP === 'object' && APP.API.init();

        dispatch({
            type: APP_WILL_MOUNT,
            app
        });
    };
}

/**
 * Signals that a specific App will unmount (in the terms of React).
 *
 * @param {App} app - The App which will unmount.
 * @returns {{
 *     type: APP_WILL_UNMOUNT,
 *     app: App
 * }}
 */
export function appWillUnmount(app: Object) {
    return {
        type: APP_WILL_UNMOUNT,
        app
    };
}


 /**
 * This action is responsible to choos whether you want all features or only chat and poll in the conference
 * @param clientType - where Choose option is defined
 * @returns 
 */
export function appClientType(clientType: string) {
    return {
        type: APP_CLIENT_TYPE,
        clientType
    };
}
