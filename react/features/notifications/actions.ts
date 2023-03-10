import throttle from 'lodash/throttle';

import { IStore } from '../app/types';
import UserType, { IAttendeeInfo } from '../base/app/types';
import { NOTIFICATIONS_ENABLED } from '../base/flags/constants';
import { getFeatureFlag } from '../base/flags/functions';
import { getParticipantCount } from '../base/participants/functions';

import {
    CLEAR_NOTIFICATIONS,
    HIDE_NOTIFICATION,
    SET_NOTIFICATIONS_ENABLED,
    SHOW_NOTIFICATION
} from './actionTypes';
import {
    NOTIFICATION_ICON,
    NOTIFICATION_TIMEOUT,
    NOTIFICATION_TIMEOUT_TYPE,
    NOTIFICATION_TYPE,
    SILENT_JOIN_THRESHOLD,
    SILENT_LEFT_THRESHOLD
} from './constants';
import { INotificationProps } from './types';

/**
 * Function that returns notification timeout value based on notification timeout type.
 *
 * @param {string} type - Notification type.
 * @param {Object} notificationTimeouts - Config notification timeouts.
 * @returns {number}
 */
function getNotificationTimeout(type?: string, notificationTimeouts?: {
    long?: number;
    medium?: number;
    short?: number;
}) {
    if (type === NOTIFICATION_TIMEOUT_TYPE.SHORT) {
        return notificationTimeouts?.short ?? NOTIFICATION_TIMEOUT.SHORT;
    } else if (type === NOTIFICATION_TIMEOUT_TYPE.MEDIUM) {
        return notificationTimeouts?.medium ?? NOTIFICATION_TIMEOUT.MEDIUM;
    } else if (type === NOTIFICATION_TIMEOUT_TYPE.LONG) {
        return notificationTimeouts?.long ?? NOTIFICATION_TIMEOUT.LONG;
    }

    return NOTIFICATION_TIMEOUT.STICKY;
}

/**
 * Clears (removes) all the notifications.
 *
 * @returns {{
 *     type: CLEAR_NOTIFICATIONS
 * }}
 */
export function clearNotifications() {
    return {
        type: CLEAR_NOTIFICATIONS
    };
}

/**
 * Removes the notification with the passed in id.
 *
 * @param {string} uid - The unique identifier for the notification to be
 * removed.
 * @returns {{
 *     type: HIDE_NOTIFICATION,
 *     uid: string
 * }}
 */
export function hideNotification(uid: string) {
    return {
        type: HIDE_NOTIFICATION,
        uid
    };
}

/**
 * Stops notifications from being displayed.
 *
 * @param {boolean} enabled - Whether or not notifications should display.
 * @returns {{
 *     type: SET_NOTIFICATIONS_ENABLED,
 *     enabled: boolean
 * }}
 */
export function setNotificationsEnabled(enabled: boolean) {
    return {
        type: SET_NOTIFICATIONS_ENABLED,
        enabled
    };
}

/**
 * Queues an error notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
export function showErrorNotification(props: INotificationProps, type?: string) {
    return showNotification({
        ...props,
        appearance: NOTIFICATION_TYPE.ERROR
    }, type);
}

/**
 * Queues a notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Timeout type.
 * @returns {Function}
 */
export function showNotification(props: INotificationProps = {}, type?: string) {
    return function(dispatch: IStore['dispatch'], getState: IStore['getState']) {
        const { disabledNotifications = [], notifications, notificationTimeouts } = getState()['features/base/config'];
        const enabledFlag = getFeatureFlag(getState(), NOTIFICATIONS_ENABLED, true);

        const shouldDisplay = enabledFlag
            && !(disabledNotifications.includes(props.descriptionKey ?? '')
                || disabledNotifications.includes(props.titleKey ?? ''))
            && (!notifications
                || notifications.includes(props.descriptionKey ?? '')
                || notifications.includes(props.titleKey ?? ''));

        if (shouldDisplay) {
            return dispatch({
                type: SHOW_NOTIFICATION,
                props,
                timeout: getNotificationTimeout(type, notificationTimeouts),
                uid: props.uid || Date.now().toString()
            });
        }
    };
}

/**
 * Queues a warning notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
export function showWarningNotification(props: INotificationProps, type?: string) {

    return showNotification({
        ...props,
        appearance: NOTIFICATION_TYPE.WARNING
    }, type);
}

/**
 * Queues a message notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
export function showMessageNotification(props: INotificationProps, type?: string) {
    return showNotification({
        ...props,
        concatText: true,
        titleKey: 'notify.chatMessages',
        appearance: NOTIFICATION_TYPE.NORMAL,
        icon: NOTIFICATION_ICON.MESSAGE
    }, type);
}

/**
 * An array of names of participants that have joined the conference. The array
 * is replaced with an empty array as notifications are displayed.
 *
 * @private
 * @type {string[]}
 */
let joinedParticipantsNames: string[] = [];

/**
 * A throttled internal function that takes the internal list of participant
 * names, {@code joinedParticipantsNames}, and triggers the display of a
 * notification informing of their joining.
 *
 * @private
 * @type {Function}
 */
const _throttledNotifyParticipantConnected = throttle((dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    const _attendeeInfo : IAttendeeInfo | undefined = getState()['features/base/app'].attendeeInfo
    const participantCount = getParticipantCount(getState());

    // Skip join notifications altogether for large meetings.
    if (participantCount > SILENT_JOIN_THRESHOLD) {
        joinedParticipantsNames = [];

        return;
    }

    const joinedParticipantsCount = joinedParticipantsNames.length;

    let notificationProps;

    if (joinedParticipantsCount >= 3) {
        const [userName, userType] = joinedParticipantsNames[0]?.split('|');
        notificationProps = {
            titleArguments: {
                name: userName
            },
            titleKey: 'notify.connectedThreePlusMembers'
        };
    } else if (joinedParticipantsCount === 2) {
        const [userName1, userType1] = joinedParticipantsNames[0]?.split('|');
        const [userName2, userType2] = joinedParticipantsNames[1]?.split('|');
        notificationProps = {
            titleArguments: {
                first: userName1,
                second: userName2
            },
            titleKey: 'notify.connectedTwoMembers'
        };
    } else if (joinedParticipantsCount) {
        const [userName, userType] = joinedParticipantsNames[0]?.split('|');
        notificationProps = {
            titleArguments: {
                name: userName
            },
            titleKey: 'notify.connectedOneMember'
        };
    }

    if ( _attendeeInfo?.userType !== UserType.Viewer && notificationProps) {
        dispatch(
            showNotification(notificationProps, NOTIFICATION_TIMEOUT_TYPE.SHORT));
    }

    joinedParticipantsNames = [];

}, 2000, { leading: false });

/**
 * An array of names of participants that have left the conference. The array
 * is replaced with an empty array as notifications are displayed.
 *
 * @private
 * @type {string[]}
 */
let leftParticipantsNames: string[] = [];

/**
 * A throttled internal function that takes the internal list of participant
 * names, {@code leftParticipantsNames}, and triggers the display of a
 * notification informing of their leaving.
 *
 * @private
 * @type {Function}
 */
const _throttledNotifyParticipantLeft = throttle((dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    const _attendeeInfo : IAttendeeInfo | undefined = getState()['features/base/app'].attendeeInfo
    const participantCount = getParticipantCount(getState());

    // Skip left notifications altogether for large meetings.
    if (participantCount > SILENT_LEFT_THRESHOLD) {
        leftParticipantsNames = [];

        return;
    }

    const leftParticipantsCount = leftParticipantsNames.length;

    let notificationProps;

    if (leftParticipantsCount >= 3) {
        const [userName, userType] = leftParticipantsNames[0]?.split('|');
        notificationProps = {
            titleArguments: {
                name: userName
            },
            titleKey: 'notify.leftThreePlusMembers'
        };
    } else if (leftParticipantsCount === 2) {
        const [userName1, userType1] = leftParticipantsNames[0]?.split('|');
        const [userName2, userType2] = leftParticipantsNames[1]?.split('|');
        notificationProps = {
            titleArguments: {
                first: userName1,
                second: userName2
            },
            titleKey: 'notify.leftTwoMembers'
        };
    } else if (leftParticipantsCount) {
        const [userName, userType] = leftParticipantsNames[0]?.split('|');
        notificationProps = {
            titleArguments: {
                name: userName
            },
            titleKey: 'notify.leftOneMember'
        };
    }

    if ( _attendeeInfo?.userType !== UserType.Viewer && notificationProps) {
        dispatch(
            showNotification(notificationProps, NOTIFICATION_TIMEOUT_TYPE.SHORT));
    }

    leftParticipantsNames = [];

}, 2000, { leading: false });

/**
 * Queues the display of a notification of a participant having connected to
 * the meeting. The notifications are batched so that quick consecutive
 * connection events are shown in one notification.
 *
 * @param {string} displayName - The name of the participant that connected.
 * @returns {Function}
 */
export function showParticipantJoinedNotification(displayName: string) {
    joinedParticipantsNames.push(displayName);

    return (dispatch: IStore['dispatch'], getState: IStore['getState']) =>
        _throttledNotifyParticipantConnected(dispatch, getState);
}

/**
 * Queues the display of a notification of a participant having left to
 * the meeting. The notifications are batched so that quick consecutive
 * connection events are shown in one notification.
 *
 * @param {string} displayName - The name of the participant that left.
 * @returns {Function}
 */
export function showParticipantLeftNotification(displayName: string) {
    leftParticipantsNames.push(displayName);

    return (dispatch: IStore['dispatch'], getState: IStore['getState']) =>
        _throttledNotifyParticipantLeft(dispatch, getState);
}
