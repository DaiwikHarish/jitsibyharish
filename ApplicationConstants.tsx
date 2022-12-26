
var queryString = window.location.search;     

var urlParams = new URLSearchParams(queryString);


export class ApplicationConstants { 


      public static API_BASE_URL =config.apiUrl?config.apiUrl:"https://dev.awesomereviewstream.com/svr/api/";

      public static meetingId =urlParams.get('meetingId')
      public static userId = urlParams.get('userId')
    
    }

    