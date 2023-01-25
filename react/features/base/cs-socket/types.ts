import { IAnswerDto } from "../../cs-qa-admin/types";

export interface SocketErrorMessage {
    event: string;
    data: {
        id: string;
        rid: string;
        eventType: string;
        message: string;
        code: number;
        cause?: string;
        action?: string;
    };
}

export enum SocketMessageEventType {
    // for error messages for any sending messages from client
    MESSAGE = 'message',

    // for presenter start/stop
    START_MEETING = 'StartMeeting',
    STOP_MEETING = 'StopMeeting',
    
    // meeting start/stop 
    MEETING_ROOM_STATUS = 'MeetingRoomStatus',

    // user/presenter/admin/viewr to join/leave
    JOIN_MEETING_ROOM = 'JoinMeetingRoom',
    LEAVE_MEETING_ROOM = 'LeaveMeetingRoom',

    // qa
    QA_NOTIFICATION = 'QaNotification',

    //// Chat /////
    CHAT_NOTIFICATION = 'ChatNotification',

    COMMAND_NOTIFICATION = 'CommandNotification',

    POLL_START_MESSAGE = 'PollStartMessage',
    POLL_END_MESSAGE = 'PollEndMessage',

    // all viewer send to admin after join or leave
    STATUS_NOTIFICATION = 'StatusNotification',
}

export class UserDto {
    meetingId: string;
    userId: string;
    userName: string;
    userType: string;
}

export enum PermissionType {
    ENABLE_SCREEN_SHARE = 'ENABLE_SCREEN_SHARE',
    DISABLE_SCREEN_SHARE = 'DISABLE_SCREEN_SHARE',
    MUTE_MIC = 'MUTE_MIC',
    UNUTE_MIC = 'UNMUTE_MIC',
    DISABLE_CAMERA = 'DISABLE_CAMERA',
    ENABLE_CAMERA = 'ENABLE_CAMERA',
    ENABLE_RAISE_HAND = 'ENABLE_RAISE_HAND',
    DISABLE_RAISE_HAND = 'DISABLE_RAISE_HAND',
    ALLOWED = 'ALLOWED',
    NOT_ALLOWED = 'NOT_ALLOWED',
}

export enum CommandType {
    TO_THIS_USER = 'TO_THIS_USER',
    TO_ALL_USER_EXCEPT_THIS_USER = 'TO_ALL_USER_EXCEPT_THIS_USER',
    TO_ALL_USER = 'TO_ALL_USER',
}

export class CommandMessageDto extends UserDto {
    permissionType: PermissionType;
    commandType?: CommandType;
    toUserId: string;
}

export enum MeetingRoomStatus {
    // meeting
    MEETING_NOT_STARTED = 'MEETING_NOT_STARTED',
    MEETING_STARTED = 'MEETING_STARTED',
    MEETING_STOPPED = 'MEETINNG_STOPPED',

    // not required here as there is no stream in our socket 
    // // camera stream
    // MEETING_CAMERA_NOT_STARTED = 'MEETING_CAMERA_NOT_STARTED',
    // MEETING_CAMERA_STARTED = 'MEETING_CAMERA_STARTED',
    // MEETING_CAMERA_STOPPED = 'MEETING_CAMERA_STOPPED',

    // // screen share stream
    // MEETING_SCREEN_SHARE_NOT_STARTED = 'MEETING_CAMERA_NOT_STARTED',
    // MEETING_SCREEN_SHARE_STARTED = 'MEETING_SCREEN_SHARE_STARTED',
    // MEETING_SCREEN_SHARE_STOPPED = 'MEETING_SCREEN_SHARE_STOPPED',
}

export enum JoinRoomPermissionStatus {
    ALLOWED = 'ALLOWED',
    NOT_ALLOWED = 'NOT_ALLOWED',
}

export enum StreamStatus {
    CAMERA_PUASED_STATUS = 'CAMERA_PUASED_STATUS',
    CAMERA_PLAYED_STATUS = 'CAMERA_PLAYED_STATUS',
    MIC_MUTED_STATUS = 'MIC_MUTED_STATUS',
    MIC_UNMUTED_STATUS = 'MIC_MUTED_STATUS',
    SCREEN_SHARE_OFF_STATUS = 'SCREEN_SHARE_OFF_STATUS',
    SCREEN_SHARE_ON_STATUS = 'SCREEN_SHARE_ON_STATUS',
}

export interface IJoinMeetingRoomResponse {
    joinMeetingPermissionStatus: JoinRoomPermissionStatus;
    screenShareStatus: MeetingRoomStatus; // presenter screen share status
    cameraStatus: MeetingRoomStatus; // presenter camera status
    meetingStatus: MeetingRoomStatus;
}

////// question & answer ///////

export interface IQuestionDto {
    id?: string;
    meetingId?: string;
    fromUserId?: string;
    fromUserName?: string;
    fromuserType?: string;
    fromUserEmailId?: string;
    fromUserMobileNr?: string;
    question?: string;
    createdAt?: string;
    updatedAt?: string;
    answers?:IAnswerDto;
}

export class QANotificationDto extends UserDto {
    questionId: string;
    answerId?: string;
    toUserId?: string;
    data: IQuestionDto;
}

////// chat ///////
export interface IChatDto {
    id?: string;
    meetingId?: string;
    fromUserId?: string;
    fromUserName?: string;
    fromUserType?: string;
    toUserId?: string;
    toUserName?: string;
    toUserType?: string;
    message?: string;
    createdAt: string ;
    updatedAt: string ;
}

export class ChatNotificationDto extends UserDto {
    chatId: string;
    toUserId?: string;
    data: IChatDto;
}

///// poll //////
export class PollAnswerOptionDto {
    id: number;
    answerLabel: string;
    answerOption: string;
    displaySeqNr: number;
    isCorrect: boolean;
    isSelected: boolean;
    createdUserId: string;
    updatedUserId: string;
    createdAt: string;
    updatedAt: string;
    pollStatistics?: string;
    pollPercentage?: null;
}

export class PollQuestionDto {
    id: number;
    question: string;
    isPublished?: boolean;
    groupId: number;
    groupName?: string;
    answerOptions?: PollAnswerOptionDto[];
    createdUserId: string;
    updatedUserId: string;
    isAnswerTypeSingle?: boolean;
    startPollDateTime?: string;
    endPollDateTime?: string;
    createdAt: string;
    updatedAt: string;
    totalUsersAnswered?: string;
    usersAnsweredPercentage?: number;
}

export class PollQuestionsDto {
    data: PollQuestionDto[];
    total: number;
}
