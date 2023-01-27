import { DEFAULT_CS_BASE_API_URL } from "./react/features/base/app/types";

var queryString = window.location.search;     

var urlParams = new URLSearchParams(queryString);


export class ApplicationConstants { 


      public static API_BASE_URL =config.apiUrl?config.apiUrl:DEFAULT_CS_BASE_API_URL;

      public static meetingId =urlParams.get('meetingId') ? urlParams.get('meetingId')  :config.recordingMeetingId
      public static userId = urlParams.get('userId') ? urlParams.get('userId') :config.recordingUserId
    
    }

    