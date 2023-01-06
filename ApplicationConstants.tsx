
var queryString = window.location.search;     

var urlParams = new URLSearchParams(queryString);


export class ApplicationConstants { 


      public static API_BASE_URL =config.apiUrl?config.apiUrl:"https://dev.awesomereviewstream.com/svr/api/";

      public static meetingId =urlParams.get('meetingId') ? urlParams.get('meetingId')  :config.recordingMeetingId
      public static userId = urlParams.get('userId') ? urlParams.get('userId') :config.recordingUserId
    
    }

    