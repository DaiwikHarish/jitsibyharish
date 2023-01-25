import { IReduxState, IStore } from '../../app/types';

export type IStateful = Function | IStore | IReduxState;

export const AppName = 'Awesome Review';

export const YYYY_MM_DD_T_HH_MM_SS = 'YYYY-MM-DDTHH:mm:ss';
export const UI_DATE_FORMAT = "DD/MM/YYYY";
export const UI_TIMESTAMP_FORMAT = 'H:mm';

export default class UserType {
    public static Admin = 'Admin';
    public static Presenter = 'Presenter';
    public static Viewer = 'Viewer';
}

export interface IUrlInfo {
    meetingId: string;
    userId: string;
}

export interface IAttendeeInfo {
    createdAt: string;
    emailId: string;
    id: string;
    isAllowed: boolean;
    isOnline: boolean;
    meetingId: string;
    mobileNr: string;
    notificationDuration: number;
    notifyMe: boolean;
    updatedAt: string;
    userId: string;
    userName: string;
    userType: string;
    isScreenShare: boolean;
    isMute: boolean;
}

export interface IMeetingInfo {
    cancelReason: string;
    clientId: string;
    createdAt: string;
    description: string;
    endDateTime: string;
    id: string;
    name: string;
    organizerId: string;
    startDateTime: string;
    status: string;
    updatedAt: string;
}

