// @flow

import { translate } from '../base/i18n';
import { IconChatUnread } from '../base/icons';
import { AbstractButton, type AbstractButtonProps } from '../base/toolbox/components';

/**
 * The type of the React {@code Component} props of
 * {@link PollButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * Whether or not audio only mode is currently enabled.
     */
    _audioOnly: boolean,

    /**
     * The currently configured maximum quality resolution to be received from
     * and sent to remote participants.
     */
    _Poll: number,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * React {@code Component} responsible for displaying a button in the overflow
 * menu of the toolbar, including an icon showing the currently selected
 * max receive quality.
 *
 * @augments Component
 */
class PollButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'Poll';
    label = 'Poll';
    tooltip = 'Admin Poll';
    icon = IconChatUnread;
}

export default translate(PollButton);
