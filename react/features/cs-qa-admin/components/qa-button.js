// @flow

import React from 'react';
import { translate } from '../../base/i18n';

import { IconQuestion } from '../../base/icons';

import { connect } from '../../base/redux';

import {
    AbstractButton,
    type AbstractButtonProps,
} from '../../base/toolbox/components';

/**
 * The type of the React {@code Component} props of {@link ParticipantsPaneButton}.
 */
type Props = AbstractButtonProps & {
    /**
     * Whether or not the participants pane is open.
     */
    _isOpen: boolean,
    _qaUnseenCount: number
};

/**
 * Implementation of a button for accessing participants pane.
 */
class QuestionAnswerButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.participants';
    icon = IconQuestion;
    label = 'toolbar.participants';
    tooltip = 'Questions & Answers';

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
            <div className="toolbar-button-with-badge" key="chatcontainer">
                {super.render()}
                <span className="badge-round">
                    <span id="mainchatcounter">
                        {this.props._qaUnseenCount}
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
function mapStateToProps(state) {
    const { isOpen } = state['features/participants-pane'];
    const { qaUnseenCount } = state['features/cs-qa-admin'].unSeenCount;

    return {
        _isOpen: isOpen,
        _qaUnseenCount:qaUnseenCount
    };
}

export default translate(connect(mapStateToProps)(QuestionAnswerButton));
