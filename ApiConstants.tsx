

import { ApplicationConstants } from './ApplicationConstants';

export class ApiConstants {

    public static latestPoll                        = ApplicationConstants.API_BASE_URL + "poll-group/latest?meetingId="+ApplicationConstants.meetingId;
     
    public static chat                        = ApplicationConstants.API_BASE_URL + "chat?meetingId="+ApplicationConstants.meetingId+"&userId="+ApplicationConstants.userId;
    public static poll                        = ApplicationConstants.API_BASE_URL + "poll";
       public static question                        = ApplicationConstants.API_BASE_URL + "question?meetingId="+ApplicationConstants.meetingId+"&userId="+ApplicationConstants.userId;
    
    public static attendee                        = ApplicationConstants.API_BASE_URL + "attendee"



    public static meeting                        = ApplicationConstants.API_BASE_URL + "meeting?meetingId="+ApplicationConstants?.meetingId;
 
    
}