import ReducerRegistry from '../redux/ReducerRegistry';
import {
    APP_SOCKET_CONNECT,
    APP_SOCKET_DISCONNECT,
    APP_SOCKET_JOIN_ROOM,
    APP_SOCKET_CHAT_MESSAGE,
    APP_SOCKET_QA_MESSAGE,
    APP_SOCKET_SEND_COMMAND_MESSAGE,
    APP_SOCKET_RECEIVED_COMMAND_MESSAGE,
    APP_SOCKET_POLL_START_MESSAGE,
    APP_SOCKET_POLL_END_MESSAGE,
    APP_SOCKET_MEETING_ROOM_STATUS,
} from './actionTypes';
import {
    IJoinMeetingRoomResponse,
    ChatNotificationDto,
    QANotificationDto,
    CommandMessageDto,
    SocketErrorMessage,
    PollQuestionDto,
    MeetingRoomStatus,
} from './types';

export interface ICSSocketState {
    socketError?: SocketErrorMessage | null;

    /// socket connect / disconnect
    isSocketConnected?: boolean;

    socketMeetingRoomStatus: MeetingRoomStatus | null;

    socketJoinRoomStatus?: IJoinMeetingRoomResponse | null;

    // socket send command message
    socketSendCommandMessage?: CommandMessageDto | null;

    // socket received command message
    socketReceivedCommandMessage?: CommandMessageDto | null;

    // socket chat message
    socketChatMessage?: ChatNotificationDto | null;

    // socket qa message
    socketQaMessage?: QANotificationDto | null;

    socketPollStartMessage?: PollQuestionDto | null;
    socketPollEndMessage?: PollQuestionDto | null;
}

const DEFAULT_STATE: ICSSocketState = {
    socketError: null,
    isSocketConnected: false,

    socketMeetingRoomStatus: MeetingRoomStatus.MEETING_NOT_STARTED,

    socketJoinRoomStatus: null,

    socketSendCommandMessage: null,
    socketReceivedCommandMessage: null,

    socketChatMessage: null,
    socketQaMessage: null,
    
    socketPollStartMessage: null,
    socketPollEndMessage: null,
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

            case APP_SOCKET_MEETING_ROOM_STATUS:
                const { socketMeetingRoomStatus } = action;
                return {
                    ...state,
                    socketMeetingRoomStatus,
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

            case APP_SOCKET_POLL_START_MESSAGE:
                const { socketPollStartMessage } = action;
                return {
                    ...state,
                    socketPollStartMessage,
                };
                break;
            case APP_SOCKET_POLL_END_MESSAGE:
                const { socketPollEndMessage } = action;
                return {
                    ...state,
                    socketPollEndMessage,
                };
                break;
            default:
                return state;
        }
    }
);
