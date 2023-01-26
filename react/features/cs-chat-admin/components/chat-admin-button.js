// @flow

import React from 'react';
import { dumpLog } from '../../app/functions.any';
import { translate } from '../../base/i18n';

import { IconChat, IconQuestion } from '../../base/icons';
import { IReduxState } from '../../app/types';
import { connect } from '../../base/redux';

import {
    AbstractButton,
    type AbstractButtonProps,
} from '../../base/toolbox/components';

type Props = AbstractButtonProps & {
    /**
     * Whether or not the participants pane is open.
     */

    _chatUnseenCount: number,
};
/**
 * Implementation of a button for accessing participants pane.
 */
class ChatAdminButton extends AbstractButton<Props, *> {
    constructor(props: Props) {
        super(props);
    }
    accessibilityLabel = 'toolbar.accessibilityLabel.chat';
    icon = IconChat;
    label = 'Chat';
    tooltip = 'Chat';

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    // _isToggled() {
    //     return this.props._isOpen;
    // }
    render(): React$Node {
        return (
            <div className="toolbar-button-with-badge">
                {super.render()}
                <span className="badge-round">
                    <span id="mainchatcounter">
                    {this.props._chatUnseenCount != 0
                            ? this.props._chatUnseenCount
                            : ''}
                    </span>
                </span>
                {/* <ChatCounter /> */}
            </div>
        );
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function mapStateToProps(state: IReduxState) {
    const chatUnseenCount = state['features/cs-chat-admin'].unSeenCount;
    dumpLog('alam chatUnseenCount', chatUnseenCount);
    return {
        _chatUnseenCount: chatUnseenCount,
    };
}

export default translate(connect(mapStateToProps)(ChatAdminButton));
