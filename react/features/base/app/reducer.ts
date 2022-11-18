import ReducerRegistry from '../redux/ReducerRegistry';

import { APP_WILL_MOUNT, APP_WILL_UNMOUNT } from './actionTypes';

export default class UserType {
    public static Admin = 'Admin';
    public static Presenter = 'Presenter';
    public static Viewer = 'Viewer';
}

export interface IUserInfo {
    userType?: string;
    userName?: string;
    emailId?: string;
    meetingId?: string;
    meetingName?: string;
}

export interface IAppState {
    app?: any;
    userInfo?: IUserInfo;
}

ReducerRegistry.register<IAppState>(
    'features/base/app',
    (state = {}, action): IAppState => {
        switch (action.type) {
            case APP_WILL_MOUNT: {
                const { app, userInfo } = action;

                if (state.app !== app) {
                    return {
                        ...state,
                        app,
                        userInfo,
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
        }

        return state;
    }
);
