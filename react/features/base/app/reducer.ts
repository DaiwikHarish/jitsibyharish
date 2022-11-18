import ReducerRegistry from '../redux/ReducerRegistry';

import { APP_USER_INFO, APP_WILL_MOUNT, APP_WILL_UNMOUNT } from './actionTypes';

import { IUserInfo } from './types';
export interface IAppState {
    app?: any;
    userInfo?: IUserInfo;
}

ReducerRegistry.register<IAppState>(
    'features/base/app',
    (state = {}, action): IAppState => {
        switch (action.type) {
            case APP_WILL_MOUNT: {
                const { app } = action;

                if (state.app !== app) {
                    return {
                        ...state,
                        app
                    };
                }
                break;
            }

            case APP_WILL_UNMOUNT:
                if (state.app === action.app) {
                    return {
                        ...state,
                        app: undefined,
                        userInfo: undefined,
                    };
                }
                break;

            case APP_USER_INFO:
                const { userInfo } = action;
                return {
                    ...state,
                    userInfo
                }
                break;    
        }

        return state;
    }
);
