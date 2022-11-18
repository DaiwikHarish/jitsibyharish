import { IReduxState, IStore } from '../../app/types';

export type IStateful = Function | IStore | IReduxState;

export default class UserType {
    public static Admin = 'Admin';
    public static Presenter = 'Presenter';
    public static Viewer = 'Viewer';
}

export interface IUserInfo {
    userId?:string;
    userType?: string;
    userName?: string;
    emailId?: string;
    meetingId?: string;
    meetingName?: string;
}
