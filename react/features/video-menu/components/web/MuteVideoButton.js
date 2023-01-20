/* @flow */

import React from 'react';
import UserType from '../../../base/app/types';

import { translate } from '../../../base/i18n';
import { IconVideoOff,IconCamera } from '../../../base/icons';
import { connect } from '../../../base/redux';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';
import AbstractMuteVideoButton, {
    type Props,
    _mapStateToProps
} from '../AbstractMuteVideoButton';

/**
 * Implements a React {@link Component} which displays a button for disabling
 * the camera of a participant in the conference.
 *
 * NOTE: At the time of writing this is a button that doesn't use the
 * {@code AbstractButton} base component, but is inherited from the same
 * super class ({@code AbstractMuteVideoButton} that extends {@code AbstractButton})
 * for the sake of code sharing between web and mobile. Once web uses the
 * {@code AbstractButton} base component, this can be fully removed.
 */
class MuteVideoButton extends AbstractMuteVideoButton {
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);
        this._handleClickUnmute = this._handleClickUnmute.bind(this);
        this._handleClick = this._handleClick.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _videoTrackMuted, t,_attendeeInfo } = this.props;

        if (_videoTrackMuted) {
            return ( <ContextMenuItem
                accessibilityLabel = { t('dialog.muteParticipantButton') }
            className = 'mutelink'
            icon = { IconCamera }
            // eslint-disable-next-line react/jsx-handler-names
            onClick = { this._handleClickUnmute }
            text = "Enable Camera" />)
        }

        return (
           
            <ContextMenuItem
                accessibilityLabel = { t('participantsPane.actions.stopVideo') }
                className = 'mutevideolink'
                icon = { IconVideoOff }
                // eslint-disable-next-line react/jsx-handler-names
                onClick = { this._handleClick }
                text = "Disable Camera" />
        );
    }

    _handleClick: () => void;
}

export default translate(connect(_mapStateToProps)(MuteVideoButton));
