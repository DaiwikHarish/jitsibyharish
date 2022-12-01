import ReducerRegistry from '../redux/ReducerRegistry';

import { APP_ATTENDEE_INFO, APP_CLIENT_TYPE, APP_MEETING_INFO, APP_URL_INFO, APP_WILL_MOUNT, APP_WILL_UNMOUNT } from './actionTypes';

import { IAttendeeInfo, IMeetingInfo, IUrlInfo } from './types';
export interface IAppState {
    app?: any;
    urlInfo?:IUrlInfo;
    meetingInfo?:IMeetingInfo;
    attendeeInfo?: IAttendeeInfo;
    clientType?:string
}

export class OptionType{
    public static ENABLE_ALL = "Enable all feature";
    public static ENABLE_CHAT_POLL = "Enable only chat and poll"
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
                        attendeeInfo: undefined,
                    };
                }
                break;

            case APP_URL_INFO:
                const { urlInfo } = action;
                return {
                    ...state,
                    urlInfo
                }
                break; 

            case APP_ATTENDEE_INFO:
                    const { attendeeInfo } = action;
                    return {
                        ...state,
                        attendeeInfo
                    }
                break;
                    
            case APP_MEETING_INFO:
                    const { meetingInfo } = action;
                    return {
                        ...state,
                        meetingInfo
                    }
                break; 
                
            case APP_CLIENT_TYPE:
                const { clientType } = action;
                return {
                    ...state,
                    clientType
                }
                break; 
        }

        return state;
    }
);
