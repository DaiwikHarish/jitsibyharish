/*******************************************************************
 *  Chat Admin related actions
 *
 */

import { IStore } from '../app/types';
import UserType, { IAttendeeInfo } from '../base/app/types';
import { CHAT_ADMIN_UPDATE_SCREEN_ON_STATUS } from './actionTypes';
import {
    _loadAttendees,
    _selectedAttendee,
    _sendChatMessage,
    _updateAttendee,
    _updateChatDataFromSocket,
    _updateOnlineAttendeeDataFromSocket,
} from './functions';
import { IChatDto } from './types';

/***
 * It is called when user click on refersh button , and on mount of the chat admin page
 */
export function loadAttendees() {
    console.log('alam loadAttendees Initialized.....');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        console.log('alam loadAttendees CALLED.....');
        // Step 1: do process
        _loadAttendees(dispatch, getState);
    };
}

/***
 * It is called when user click on the attendee in the list item
 */
export function selectedAttendee(attendeeId: string | undefined) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _selectedAttendee(dispatch, getState, attendeeId);
    };
}

export function sendChatMessage(newMsg: string | undefined) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _sendChatMessage(dispatch, getState, newMsg);
    };
}

export function updateAttendee(isAllow: boolean) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _updateAttendee(dispatch, getState, isAllow);
    };
}


export function updateChatScreenStatus(value: boolean) {
    return {
        type: CHAT_ADMIN_UPDATE_SCREEN_ON_STATUS,
        isScreenON: value,
    };
}


export function updateChatDataFromSocket(chatData: IChatDto) {
    console.log('alam updateChatDataFromSocket Initialized.....');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        let attendeeInfo = getState()['features/base/app']?.attendeeInfo;
        if (
            attendeeInfo &&
            (attendeeInfo.userType == UserType.Presenter ||
                attendeeInfo.userType == UserType.Admin)
        ) {
            _updateChatDataFromSocket(dispatch, getState, chatData);
        }
    };
}

export function updateOnlineAttendeeDataFromSocket(attendeeData: IAttendeeInfo) {
    console.log('alam updateOnlineAttendeeDataFromSocket Initialized.....');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        let attendeeInfo = getState()['features/base/app']?.attendeeInfo;
        if (
            attendeeInfo &&
            (attendeeInfo.userType == UserType.Presenter ||
                attendeeInfo.userType == UserType.Admin)
        ) {
            _updateOnlineAttendeeDataFromSocket(dispatch, getState, attendeeData);
        }
    };
}