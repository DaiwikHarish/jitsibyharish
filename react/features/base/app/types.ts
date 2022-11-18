import { IReduxState, IStore } from '../../app/types';

export type IStateful = Function | IStore | IReduxState;

export interface IUserInfo {
    userId?:string;
    userType?: string;
    userName?: string;
    emailId?: string;
    meetingId?: string;
    meetingName?: string;
}
