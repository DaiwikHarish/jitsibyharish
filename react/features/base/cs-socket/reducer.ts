import ReducerRegistry from '../redux/ReducerRegistry';
import {
    APP_SOCKET_CONNECT,
    APP_SOCKET_DISCONNECT,
    APP_SOCKET_JOIN_ROOM,
    APP_SOCKET_CHAT_MESSAGE,
    APP_SOCKET_QA_MESSAGE,
    APP_SOCKET_SEND_COMMAND_MESSAGE,
    APP_SOCKET_RECEIVED_COMMAND_MESSAGE,
} from './actionTypes';
import {
    IJoinMeetingRoomResponse,
    ChatNotificationDto,
    QANotificationDto,
    CommandMessageDto,
    SocketErrorMessage,
} from './types';

export interface ICSSocketState {
    socketError?: SocketErrorMessage | null;

    /// socket connect / disconnect
    isSocketConnected?: boolean;

    socketJoinRoomStatus?: IJoinMeetingRoomResponse | null;

    // socket send command message
    socketSendCommandMessage?: CommandMessageDto | null;

    // socket received command message
    socketReceivedCommandMessage?: CommandMessageDto | null;

    // socket chat message
    socketChatMessage?: ChatNotificationDto | null;

    // socket qa message
    socketQaMessage?: QANotificationDto | null;
}

const DEFAULT_STATE: ICSSocketState = {
    socketError: null,
    isSocketConnected: false,
    socketJoinRoomStatus: null,

    socketSendCommandMessage: null,
    socketReceivedCommandMessage: null,

    socketChatMessage: null,
    socketQaMessage: null,
};

ReducerRegistry.register<ICSSocketState>(
    'features/base/cs-socket',
    (state = DEFAULT_STATE, action): ICSSocketState => {
        switch (action.type) {
            case APP_SOCKET_CONNECT:
            case APP_SOCKET_DISCONNECT:
                const { isSocketConnected } = action;
                return {
                    ...state,
                    isSocketConnected,
                };
                break;

            case APP_SOCKET_JOIN_ROOM:
                const { socketJoinRoomStatus } = action;
                return {
                    ...state,
                    socketJoinRoomStatus,
                };
                break;

            case APP_SOCKET_SEND_COMMAND_MESSAGE:
                const { socketSendCommandMessage } = action;
                return {
                    ...state,
                    socketSendCommandMessage,
                };
                break;

            case APP_SOCKET_RECEIVED_COMMAND_MESSAGE:
                const { socketReceivedCommandMessage } = action;
                return {
                    ...state,
                    socketReceivedCommandMessage,
                };
                break;                

            case APP_SOCKET_CHAT_MESSAGE:
                const { socketChatMessage } = action;
                return {
                    ...state,
                    socketChatMessage,
                };
                break;

            case APP_SOCKET_QA_MESSAGE:
                const { socketQaMessage } = action;
                return {
                    ...state,
                    socketQaMessage,
                };
                break;
            default:
                return state;
        }
    }
);
