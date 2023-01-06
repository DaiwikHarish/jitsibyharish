
config.appUrl='https://dev.awesomereviewstream.com';
config.apiUrl=config.appUrl + '/svr/api/';
config.socketUrl=config.appUrl + '/svr/ws/one2many/';

// Custom Configuration
config.enableWelcomePage = false;

// Polls
//config.disablePolls = false;



// prejoin page
config.prejoinConfig.enabled = true;

config.buttonsWithNotifyClick = [
    {
        key: 'chat',
        preventExecution: false
    },
    {
        key: 'invite',
        preventExecution: true
    },
]


// config.participantsPane = {
//    hideModeratorSettingsTab: true,
//    hideMoreActionsButton: true,
//    hideMuteAllButton: true
//}

config.startWithVideoMuted = true;
config.startWithAudioMuted = true;

//Note: jibri can not pass this meetingId and UserId in url , so we have to use some dummay meetingId and User for this 
  config.recordingUserId='3';
  config.recordingMeetingId='14';

