// @flow

import React from 'react';
import UserType from '../../../base/app/types';

import { translate } from '../../../base/i18n';
import { IconMuteVideoEveryoneElse } from '../../../base/icons';
import { connect } from '../../../base/redux';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';
import AbstractMuteEveryoneElsesVideoButton, {
    type Props
} from '../AbstractMuteEveryoneElsesVideoButton';

/**
 * Implements a React {@link Component} which displays a button for audio muting
 * every participant in the conference except the one with the given
 * participantID.
 */
class MuteEveryoneElsesVideoButton extends AbstractMuteEveryoneElsesVideoButton {
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { t,_attendeeInfo } = this.props;

        return (
            _attendeeInfo?.userType !== UserType.Viewer &&
            <ContextMenuItem
                accessibilityLabel = { t('toolbar.accessibilityLabel.muteEveryoneElsesVideoStream') }
                icon = { IconMuteVideoEveryoneElse }
                // eslint-disable-next-line react/jsx-handler-names
                onClick = { this._handleClick }
                text = { t('videothumbnail.domuteVideoOfOthers') } />
        );
    }

    _handleClick: () => void;
}

/**
 * Maps (parts of) the redux state to the React {@code Component} props of
 * {@code ProfileTab}.
 *
 * @param {Object} state - The redux state.
 * @protected
 * @returns {Props}
 */
 export function _mapStateToProps(state: Object) {
    return {
        _attendeeInfo: state["features/base/app"].attendeeInfo
    };
}

export default translate(connect(_mapStateToProps)(MuteEveryoneElsesVideoButton));
