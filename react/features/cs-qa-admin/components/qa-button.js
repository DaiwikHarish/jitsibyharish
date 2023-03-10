// @flow

import React from 'react';
import { dumpLog } from '../../app/functions.any';
import { translate } from '../../base/i18n';

import { IconQuestion } from '../../base/icons';
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

    _qaUnseenCount: number,
};
/**
 * Implementation of a button for accessing participants pane.
 */
class QuestionAnswerButton extends AbstractButton<Props, *> {
    constructor(props: Props) {
        super(props);
    }
    accessibilityLabel = 'toolbar.accessibilityLabel.participants';
    icon = IconQuestion;
    label = 'Questions & Answers';
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
        // dumpLog('alam qaCount', this.props._qaUnseenCount);
        return (
            <div className="toolbar-button-with-badge">
                {super.render()}
                <span className="badge-round">
                    <span id="mainchatcounter">
                        {this.props._qaUnseenCount != 0
                            ? this.props._qaUnseenCount
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
    const qaUnseenCount = state['features/cs-qa-admin'].unSeenCount;
    // dumpLog('alam qaUnseenCount', qaUnseenCount);
    return {
        _qaUnseenCount: qaUnseenCount,
    };
}

export default translate(connect(mapStateToProps)(QuestionAnswerButton));
