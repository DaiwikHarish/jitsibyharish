/*******************************************************************
 *  Chat Admin related actions
 *
 */

import { IStore } from '../app/types';
import {
    _loadAttendees,
    _selectedAttendee,
    _sendChatMessage,
    _updateAttendee,
} from './functions';

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
