/* @flow */

import React from 'react';
import UserType from '../../../base/app/types';

import { translate } from '../../../base/i18n';
import { IconMicrophoneEmptySlash,IconMicrophoneEmpty } from '../../../base/icons';
import { connect } from '../../../base/redux';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';
import AbstractMuteButton, {
    type Props,
    _mapStateToProps
} from '../AbstractMuteButton';


/**
 * Implements a React {@link Component} which displays a button for audio muting
 * a participant in the conference.
 *
 * NOTE: At the time of writing this is a button that doesn't use the
 * {@code AbstractButton} base component, but is inherited from the same
 * super class ({@code AbstractMuteButton} that extends {@code AbstractButton})
 * for the sake of code sharing between web and mobile. Once web uses the
 * {@code AbstractButton} base component, this can be fully removed.
 */
class MuteButton extends AbstractMuteButton {
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
        this._handleClickUnmute = this._handleClickUnmute.bind(this);
        
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _audioTrackMuted, t, _attendeeInfo } = this.props;

        if (_audioTrackMuted) {
            return ( <ContextMenuItem
                accessibilityLabel = { t('dialog.muteParticipantButton') }
            className = 'mutelink'
            icon = { IconMicrophoneEmpty }
            // eslint-disable-next-line react/jsx-handler-names
            onClick = { this._handleClickUnmute }
            text = "UnMute" />)
        }

        return (
            // _attendeeInfo.userType !== UserType.Viewer &&
            <ContextMenuItem
                accessibilityLabel = { t('dialog.muteParticipantButton') }
                className = 'mutelink'
                icon = { IconMicrophoneEmptySlash }
                // eslint-disable-next-line react/jsx-handler-names
                onClick = { this._handleClick }
                text = { t('dialog.muteParticipantButton') } />
        );
    }

    _handleClick: () => void;


    _handleClickUnmute: () => void;
}

export default translate(connect(_mapStateToProps)(MuteButton));
