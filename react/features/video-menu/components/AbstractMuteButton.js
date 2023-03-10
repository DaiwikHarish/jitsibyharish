// @flow

import {
    createRemoteVideoMenuButtonEvent,
    sendAnalytics
} from '../../analytics';
import { useDispatch, useSelector } from 'react-redux';
import { rejectParticipantAudio } from '../../av-moderation/actions';
import { IconMicDisabled } from '../../base/icons';
import { MEDIA_TYPE } from '../../base/media';
import { AbstractButton, type AbstractButtonProps } from '../../base/toolbox/components';
import { isRemoteTrackMuted } from '../../base/tracks';
import { muteRemote } from '../actions.any';
import { socketSendCommandMessage } from "../../base/cs-socket/actions";

import { CommandMessageDto, CommandType, PermissionType } from "../../base/cs-socket/types";

export type Props = AbstractButtonProps & {

    /**
     * Boolean to indicate if the audio track of the participant is muted or
     * not.
     */
    _audioTrackMuted: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function,

    /**
     * The ID of the participant object that this button is supposed to
     * mute/unmute.
     */
    participantID: string,
    participantAPIID: string,
    /**
     * The function to be used to translate i18n labels.
     */
    t: Function
};

/**
 * An abstract remote video menu button which mutes the remote participant.
 */
export default class AbstractMuteButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.remoteMute';
    icon = IconMicDisabled;
    label = 'videothumbnail.domute';
    toggledLabel = 'videothumbnail.muted';
    

    /**
     * Handles clicking / pressing the button, and mutes the participant.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantID,participantAPIID } = this.props;

        sendAnalytics(createRemoteVideoMenuButtonEvent(
            'mute',
            {
                'participant_id': participantID
            }));

        dispatch(muteRemote(participantID, MEDIA_TYPE.AUDIO));
        dispatch(rejectParticipantAudio(participantID));

        dispatch(
            socketSendCommandMessage(
                participantAPIID.trim(),
                PermissionType.MUTE_MIC,
                CommandType.TO_THIS_USER
            ))
    }

    _handleClickUnmute() {
        const { dispatch, participantID,participantAPIID } = this.props;
        dispatch(
            socketSendCommandMessage(
                participantAPIID.trim(),
                PermissionType.UNUTE_MIC,
                CommandType.TO_THIS_USER
            ))
    }

    

    /**
     * Renders the item disabled if the participant is muted.
     *
     * @inheritdoc
     */
    _isDisabled() {
        return this.props._audioTrackMuted;
    }

    /**
     * Renders the item toggled if the participant is muted.
     *
     * @inheritdoc
     */
    _isToggled() {
        return this.props._audioTrackMuted;
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {{
 *      _audioTrackMuted: boolean
 *  }}
 */
export function _mapStateToProps(state: Object, ownProps: Props) {
    const tracks = state['features/base/tracks'];

    return {
        _audioTrackMuted: isRemoteTrackMuted(
            tracks, MEDIA_TYPE.AUDIO, ownProps.participantID, ownProps.participantAPIID),
            _attendeeInfo: state["features/base/app"].attendeeInfo
    };
}
