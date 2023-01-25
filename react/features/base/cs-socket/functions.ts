import { io, Socket } from 'socket.io-client';
import { ApiConstants } from '../../../../ApiConstants';
import { ApplicationConstants } from '../../../../ApplicationConstants';
import { IStore } from '../../app/types';
import UserType, { IAttendeeInfo } from '../app/types';

import {
    socketJoinRoom,
    socketSendCommandMessage,
    socketStartMeeting,
} from './actions';
import {
    APP_SOCKET_CHAT_MESSAGE,
    APP_SOCKET_CONNECT,
    APP_SOCKET_DISCONNECT,
    APP_SOCKET_JOIN_ROOM,
    APP_SOCKET_MEETING_ROOM_STATUS,
    APP_SOCKET_POLL_END_MESSAGE,
    APP_SOCKET_POLL_START_MESSAGE,
    APP_SOCKET_QA_MESSAGE,
    APP_SOCKET_RECEIVED_COMMAND_MESSAGE,
    APP_SOCKET_SEND_COMMAND_MESSAGE,
} from './actionTypes';
import {
    SocketMessageEventType,
    UserDto,
    IJoinMeetingRoomResponse,
    CommandMessageDto,
    PermissionType,
    CommandType,
    MeetingRoomStatus,
} from './types';

// global object
export let _csSocket: Socket;

export function _initSocket(
    dispatch: IStore['dispatch'],
    getState: IStore['getState']
) {
    let attendeeInfo = getState()['features/base/app']?.attendeeInfo;

    console.log('Socket called init', attendeeInfo);
    let appUrl = config.appUrl
        ? config.appUrl
        : 'https://dev.awesomereviewstream.com';
    let one2ManyPath = '/svr/ws/one2many';

    _csSocket = io(appUrl, {
        path: one2ManyPath,
        closeOnBeforeunload: false,
    });

    if (_csSocket == null) return;

    // Socket Connected Event
    _csSocket.on('connect', () => {
        console.log('Socket:Connected to Streaming Server Successfully...!');

        dispatch({
            type: APP_SOCKET_CONNECT,
            isSocketConnected: true,
        });

        // if the user type is presenter call start meeting ,
        // otherwise call join room
        _checkAndStartOrJoinMeeting(dispatch);
    });

    // Socket Connection Error
    _csSocket.on('connect_error', () => {
        console.log('Socket:connect_error Socket connection failed ');

        dispatch({
            type: APP_SOCKET_DISCONNECT,
            isSocketConnected: false,
        });
    });

    // Socket Disconnection
    _csSocket.on('disconnect', (reason: string) => {
        console.log(
            'Socket:connect_error Socket connection failed due to ' + reason
        );

        dispatch({
            type: APP_SOCKET_DISCONNECT,
            isSocketConnected: false,
        });
    });

    ////////////// receive message events ///////////

    // Socket error message for sending message from client
    _csSocket.on(SocketMessageEventType.MESSAGE, (input: string) => {
        console.log('Socket:error message ', input);
    });

    // Socket command message received
    _csSocket.on(SocketMessageEventType.COMMAND_NOTIFICATION, (msg) => {
        console.log('Socket: Command message received ', msg);
        dispatch({
            type: APP_SOCKET_RECEIVED_COMMAND_MESSAGE,
            socketReceivedCommandMessage: msg,
        });
    });

    // Question and answer Notification
    _csSocket.on(SocketMessageEventType.QA_NOTIFICATION, (msg) => {
        console.log('socket QA message received => ', msg);
        dispatch({
            type: APP_SOCKET_QA_MESSAGE,
            socketQaMessage: msg,
        });
    });

    // chat notification here
    _csSocket.on(SocketMessageEventType.CHAT_NOTIFICATION, (msg) => {
        console.log('socket Chat message received => ', msg);
        dispatch({
            type: APP_SOCKET_CHAT_MESSAGE,
            socketChatMessage: msg,
        });
    });

    // Meeting room satus here
    _csSocket.on(SocketMessageEventType.MEETING_ROOM_STATUS, (msg: string) => {
        console.log('socket meeting room status message received => ', msg);
        dispatch({
            type: APP_SOCKET_MEETING_ROOM_STATUS,
            socketMeetingRoomStatus: msg,
        });

        // join again only if meeting status comes as meeting started
        // otherwise no action
        if (msg == MeetingRoomStatus.MEETING_STARTED) {
            dispatch(socketJoinRoom());
        }
    });

    // poll start message here
    _csSocket.on(SocketMessageEventType.POLL_START_MESSAGE, (msg) => {
        console.log('socket Poll start message received => ', msg);
        dispatch({
            type: APP_SOCKET_POLL_START_MESSAGE,
            socketPollStartMessage: msg,
        });
    });

    // poll end message here
    _csSocket.on(SocketMessageEventType.POLL_END_MESSAGE, (msg) => {
        console.log('socket Poll end message received => ', msg);
        dispatch({
            type: APP_SOCKET_POLL_END_MESSAGE,
            socketPollEndMessage: msg,
        });
    });
}

export function _destroySocket(dispatch: IStore['dispatch']) {
    console.log('Socket called destroy ');
    if (_csSocket) {
        _csSocket.disconnect();
    }
}

export function _getUserDto(attendee: IAttendeeInfo) {
    let dto: UserDto = {
        userId: attendee.userId?attendee.userId:'',
        meetingId: attendee.meetingId?attendee.meetingId:'',
        userName: attendee.userName?attendee.userName:'',
        userType: attendee.userType?attendee.userType:'',
    };

    return dto;
}

export function _socketStartMeeting(
    dispatch: IStore['dispatch'],
    getState: IStore['getState']
) {
    let attendeeInfo = getState()['features/base/app']?.attendeeInfo;

    if (attendeeInfo) {
        let userDto = _getUserDto(attendeeInfo);
        _csSocket.emit(
            SocketMessageEventType.START_MEETING,
            userDto,
            (response: string) => {
                console.log(' _socketStartMeeting success response ', response);
                dispatch({
                    type: APP_SOCKET_MEETING_ROOM_STATUS,
                    socketMeetingRoomStatus: response,
                });
            }
        );
    }
}

export function _socketStopMeeting(
    dispatch: IStore['dispatch'],
    getState: IStore['getState']
) {
    let attendeeInfo = getState()['features/base/app']?.attendeeInfo;
    if (attendeeInfo) {
        let userDto = _getUserDto(attendeeInfo);
        _csSocket.emit(
            SocketMessageEventType.STOP_MEETING,
            userDto,
            (response: string) => {
                console.log(' _socketStopMeeting success response ', response);
                dispatch({
                    type: APP_SOCKET_MEETING_ROOM_STATUS,
                    socketMeetingRoomStatus: response,
                });
            }
        );
    }
}

export function _socketLeaveRoom(
    dispatch: IStore['dispatch'],
    getState: IStore['getState']
) {
    let attendeeInfo = getState()['features/base/app']?.attendeeInfo;

    if (attendeeInfo) {
        let userDto = _getUserDto(attendeeInfo);
        _csSocket.emit(
            SocketMessageEventType.LEAVE_MEETING_ROOM,
            userDto,
            (response: string) => {
                console.log(' socketLeaveRoom success response ', response);
            }
        );
    }
}

export function _socketJoinRoom(
    dispatch: IStore['dispatch'],
    getState: IStore['getState']
) {
    let attendeeInfo = getState()['features/base/app']?.attendeeInfo;
    if (attendeeInfo) {
        let userDto = _getUserDto(attendeeInfo);
        _csSocket.emit(
            SocketMessageEventType.JOIN_MEETING_ROOM,
            userDto,
            (response: IJoinMeetingRoomResponse) => {
                console.log(' socketJoinRoom success response ', response);
                dispatch({
                    type: APP_SOCKET_JOIN_ROOM,
                    socketJoinRoomStatus: response,
                });

                // // for test
                // dispatch(socketSendCommandMessage(
                //     '1',
                //     PermissionType.ENABLE_SCREEN_SHARE,
                //     CommandType.TO_THIS_USER
                // ));
            }
        );
    }
}

export function _socketSendCommandMessage(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    toUserId: string,
    permissionType: PermissionType,
    commandType: CommandType
) {
    let attendeeInfo = getState()['features/base/app']?.attendeeInfo;
    if (attendeeInfo) {
        let userDto = _getUserDto(attendeeInfo);

        let commandMsgDto: CommandMessageDto = new CommandMessageDto();
        commandMsgDto.meetingId = userDto.meetingId;
        commandMsgDto.userName = userDto.userName;
        commandMsgDto.userId = userDto.userId;
        commandMsgDto.userType = userDto.userType;
        commandMsgDto.toUserId = toUserId;
        commandMsgDto.commandType = commandType;
        commandMsgDto.permissionType = permissionType;

        _csSocket.emit(
            SocketMessageEventType.COMMAND_NOTIFICATION,
            commandMsgDto,
            (response: string) => {
                console.log(
                    ' _socketSendCommandMessage success response ',
                    response
                );
                dispatch({
                    type: APP_SOCKET_SEND_COMMAND_MESSAGE,
                    socketSendCommandMessage: commandMsgDto,
                });
            }
        );
    }
}

function _checkAndStartOrJoinMeeting(dispatch: IStore['dispatch']) {
    fetch(
        ApiConstants.attendee +
            '?meetingId=' +
            ApplicationConstants.meetingId +
            '&userId=' +
            ApplicationConstants.userId
    )
        .then((response) => response.json())
        .then((data) => {
            const attendee: IAttendeeInfo = data[0];
            console.log('On Connect ', attendee);
            if (attendee && attendee?.userType == UserType.Presenter) {
                console.log('On Connect start meeting');
                dispatch(socketStartMeeting());
            } else if (attendee) {
                console.log('On Connect join meeting');
                dispatch(socketJoinRoom());
            }
        })
        .catch((err) => {
            console.log('socket calls attendee api error ', err.message);
        });
}
