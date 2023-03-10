/*******************************************************************
 *  socket related actions
 *
 */

import { IStore } from '../../app/types';
import {
    _initSocket,
    _destroySocket,
    _socketJoinRoom,
    _socketLeaveRoom,
    _socketSendCommandMessage,
    _socketStartMeeting,
    _socketStopMeeting,
} from './functions';
import { CommandType, PermissionType } from './types';

export function socketConnect() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: read here from state if required
        // const { authRequired, password }  = getState()['features/base/app'];

        console.log('Inside the middleware function call socketConnect');
        // Step 2: do process
        _initSocket(dispatch, getState);
        // Step 3: dispatch if any required
    };
}

export function socketStartMeeting() {
     return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: read here from state if required
        // const { authRequired, password }  = getState()['features/base/app'];

        console.log('Inside the middleware function call socketStartMeeting');
        // Step 2: do process
        _socketStartMeeting(dispatch, getState);
        // Step 3: dispatch if any required
    };
}

export function socketStopMeeting() {
     return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: read here from state if required
        // const { authRequired, password }  = getState()['features/base/app'];

        console.log('Inside the middleware function call socketStopMeeting');
        // Step 2: do process
        _socketStopMeeting(dispatch, getState);
        // Step 3: dispatch if any required
    };
}


export function socketDisconnect() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // const { authRequired, password }  = getState()['features/base/app'];
        console.log('Inside the middleware function call socketDisconnect');
        _destroySocket(dispatch);
    };
}

export function socketJoinRoom() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        console.log('Inside the middleware function call socketJoinRoom');
        _socketJoinRoom(dispatch, getState);
    };
}

export function socketLeaveRoom() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        console.log('Inside the middleware function call socketLeaveRoom');
        _socketLeaveRoom(dispatch, getState);
    };
}

export function socketSendCommandMessage(
    toUserId: string,
    permissionType: PermissionType,
    commandType: CommandType
) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        console.log(
            'Inside the middleware function call socketSendCommandMessage',toUserId,permissionType,commandType
        );

        _socketSendCommandMessage(dispatch, getState,toUserId, permissionType, commandType);
    };
}


