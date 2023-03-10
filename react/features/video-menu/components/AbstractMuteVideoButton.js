// @flow

import {
    createRemoteVideoMenuButtonEvent,
    sendAnalytics
} from '../../analytics';
import { openDialog } from '../../base/dialog';
import { IconVideoOff } from '../../base/icons';
import { MEDIA_TYPE } from '../../base/media';
import { AbstractButton, type AbstractButtonProps } from '../../base/toolbox/components';
import { isRemoteTrackMuted } from '../../base/tracks';
import { socketSendCommandMessage } from "../../base/cs-socket/actions";
import { CommandMessageDto, CommandType, PermissionType } from "../../base/cs-socket/types";

export type Props = AbstractButtonProps & {

    /**
     * Boolean to indicate if the video track of the participant is muted or
     * not.
     */
    _videoTrackMuted: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function,

    /**
     * The ID of the participant object that this button is supposed to
     * mute/unmute.
     */
    participantID: string,

    /**
     * The function to be used to translate i18n labels.
     */
    t: Function
};

/**
 * An abstract remote video menu button which mutes the remote participant.
 */
export default class AbstractMuteVideoButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.remoteVideoMute';
    icon = IconVideoOff;
    label = 'videothumbnail.domuteVideo';
    toggledLabel = 'videothumbnail.videoMuted';

    /**
     * Handles clicking / pressing the button, and mutes the participant.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantID,participantAPIID } = this.props;
        dispatch(
            socketSendCommandMessage(
                participantAPIID.trim(),
                PermissionType.DISABLE_CAMERA,
                CommandType.TO_THIS_USER
            ))
    }
    _handleClickUnmute() {
        const { dispatch, participantID,participantAPIID } = this.props;
        dispatch(
            socketSendCommandMessage(
                participantAPIID.trim(),
                PermissionType.ENABLE_CAMERA,
                CommandType.TO_THIS_USER
            ))
    }
    /**
     * Renders the item disabled if the participant is muted.
     *
     * @inheritdoc
     */
    _isDisabled() {
        return this.props._videoTrackMuted;
    }

    /**
     * Renders the item toggled if the participant is muted.
     *
     * @inheritdoc
     */
    _isToggled() {
        return this.props._videoTrackMuted;
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {{
 *      _videoTrackMuted: boolean
 *  }}
 */
export function _mapStateToProps(state: Object, ownProps: Props) {
    const tracks = state['features/base/tracks'];

    return {
        _videoTrackMuted: isRemoteTrackMuted(
            tracks, MEDIA_TYPE.VIDEO, ownProps.participantID),
            _attendeeInfo: state["features/base/app"].attendeeInfo
    };
}
