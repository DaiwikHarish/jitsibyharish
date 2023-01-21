// @flow

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { openDialog } from '../../base/dialog';
import { IconMuteEveryone } from '../../base/icons';
import { AbstractButton, type AbstractButtonProps } from '../../base/toolbox/components';

import { MuteEveryoneDialog } from './';
import { socketSendCommandMessage } from "../../base/cs-socket/actions";

import { CommandMessageDto, CommandType, PermissionType } from "../../base/cs-socket/types";

export type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function,

    /**
     * The ID of the participant object that this button is supposed to keep unmuted.
     */
    participantID: string,

    /**
     * The function to be used to translate i18n labels.
     */
    t: Function
};

/**
 * An abstract remote video menu button which mutes all the other participants.
 */
export default class AbstractMuteEveryoneElseButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.muteEveryoneElse';
    icon = IconMuteEveryone;
    label = 'videothumbnail.domuteOthers';

    /**
     * Handles clicking / pressing the button, and opens a confirmation dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch,participantAPIID, participantID } = this.props;

        sendAnalytics(createToolbarEvent('mute.everyoneelse.pressed'));
        // dispatch(openDialog(MuteEveryoneDialog, { exclude: [ participantID ] }));
       
       
        dispatch(
            socketSendCommandMessage(
                participantAPIID.trim(),
                PermissionType.MUTE_MIC,
                CommandType.TO_ALL_USER_EXCEPT_THIS_USER
            ))
    }
}
