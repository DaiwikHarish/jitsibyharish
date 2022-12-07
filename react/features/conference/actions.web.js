// @flow

import type { Dispatch } from 'redux';

import { getParticipantDisplayName } from '../base/participants';
import {
    NOTIFICATION_TIMEOUT_TYPE,
    NOTIFICATION_TYPE,
    showNotification
} from '../notifications';

import { IAttendeeInfo } from '../base/app/types'
import { _onKickedOut } from './functions.web';

/**
 * Notify that we've been kicked out of the conference.
 *
 * @param {JitsiParticipant} participant - The {@link JitsiParticipant}
 * instance which initiated the kick event.
 * @param {?Function} _ - Used only in native code.
 * @returns {Function}
 */
export function notifyKickedOut(participant: Object, _: ?Function) { // eslint-disable-line no-unused-vars
    return (dispatch: Dispatch<any>, getState: Function) => {
        const _attendeeInfo: IAttendeeInfo = getState()['features/base/app'].attendeeInfo
        if (!participant || (participant.isReplaced && participant.isReplaced())) {
            return;
        }

        const args = {
            participantDisplayName:
                getParticipantDisplayName(getState, participant.getId())
        };

        _onKickedOut(_attendeeInfo.id)

        dispatch(showNotification({
            appearance: NOTIFICATION_TYPE.ERROR,
            hideErrorSupportLink: true,
            descriptionKey: 'Sorry, you have been removed from conference',
            descriptionArguments: args,
            titleKey: 'Removed by Admin',
            titleArguments: args
        }, NOTIFICATION_TIMEOUT_TYPE.STICKY));
    };
}
