import { IAttendeeInfo } from '../base/app/types';
import ReducerRegistry from '../base/redux/ReducerRegistry';
import {
    CHAT_ADMIN_ISLOADING_STATUS,
    CHAT_ADMIN_SELECTED_ATTENDEE,
    CHAT_ADMIN_UPDATE_ATTENDEES,
    CHAT_ADMIN_UPDATE_CHAT_HISTORY,
} from './actionTypes';
import { IChatDto } from './types';

export interface ICSChatAdminState {
    // api call request/response time
    isLoading?: boolean;
    messageType?: string | null;
    message?: string | null;

    // UI to show
    attendees?: IAttendeeInfo[];
    onLineCount?: number;
    total?: number;
    selectedAttendeeId?: string | null;
    chatHistory?: IChatDto[];
}

const DEFAULT_STATE: ICSChatAdminState = {
    isLoading: false,
    message: null,
    onLineCount: 0,
    total: 0,
    attendees: [],
    selectedAttendeeId: null,
    chatHistory: [],
};

ReducerRegistry.register<ICSChatAdminState>(
    'features/cs-chat-admin',
    (state = DEFAULT_STATE, action): ICSChatAdminState => {
        switch (action.type) {
            case CHAT_ADMIN_ISLOADING_STATUS:
                if (action?.messageType) {
                    return {
                        ...state,
                        isLoading: action.isLoading,
                        messageType: action?.messageType,
                        message: action?.message,
                    };
                } else {
                    return {
                        ...state,
                        isLoading: action.isLoading,
                    };
                }
                break;
            case CHAT_ADMIN_UPDATE_ATTENDEES:
                return {
                    ...state,
                    isLoading: action.isLoading,
                    attendees: action?.attendees,
                    onLineCount: Object.values(action?.attendees)?.filter(
                        (x: any) => x.isOnline === true
                    ).length,
                    total: action?.attendees.length,
                };
                break;

            case CHAT_ADMIN_UPDATE_CHAT_HISTORY:
                return {
                    ...state,
                    isLoading: action.isLoading,
                    chatHistory: action.chatHistory,
                };
                break;

            case CHAT_ADMIN_SELECTED_ATTENDEE:
                return {
                    ...state,
                    selectedAttendeeId: action.selectedAttendeeId,
                };
                break;

            default:
                return state;
        }
    }
);
