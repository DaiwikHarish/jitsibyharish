import { IAttendeeInfo } from "../base/app/types";

export interface IChatDto  {
  id?: string;
  meetingId?: string;
  fromUserId?: string;
  fromUserName?: string;
  fromUserType?: string;
  toUserId?: string;
  toUserName?: string;
  toUserType?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IChatsDto {
  data: IChatDto[];
  total: number;
}


export interface IAPIResponse {
    response?:any;
    status:boolean;
    message?:string;
}

export interface IAttendeeUnSeenCount extends IAttendeeInfo {
  unSeenCount:number;
}