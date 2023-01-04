
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

