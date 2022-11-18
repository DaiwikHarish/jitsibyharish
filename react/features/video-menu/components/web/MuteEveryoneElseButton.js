// @flow

import React from 'react';
import UserType from '../../../base/app/types';

import { translate } from '../../../base/i18n';
import { IconMuteEveryoneElse } from '../../../base/icons';
import { connect } from '../../../base/redux';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';
import AbstractMuteEveryoneElseButton, {
    type Props
} from '../AbstractMuteEveryoneElseButton';

/**
 * Implements a React {@link Component} which displays a button for audio muting
 * every participant in the conference except the one with the given
 * participantID.
 */
class MuteEveryoneElseButton extends AbstractMuteEveryoneElseButton {
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
        const { t,_userInfo } = this.props;

        return (

            _userInfo.userType=== UserType.Admin &&
            <ContextMenuItem
                accessibilityLabel = { t('toolbar.accessibilityLabel.muteEveryoneElse') }
                icon = { IconMuteEveryoneElse }
                // eslint-disable-next-line react/jsx-handler-names
                onClick = { this._handleClick }
                text = { t('videothumbnail.domuteOthers') } />
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
        _userInfo: state["features/base/app"].userInfo
    };
}

export default translate(connect(_mapStateToProps)(MuteEveryoneElseButton));
