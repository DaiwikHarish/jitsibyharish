import { Theme } from '@mui/material';
import React, { ReactElement, useCallback } from 'react';
import { WithTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import UserType, { IAttendeeInfo} from '../../../base/app/types';

// @ts-ignore
import { Avatar } from '../../../base/avatar';
import ListItem from '../../../base/components/participants-pane-list/ListItem';
import { translate } from '../../../base/i18n/functions';
import { withPixelLineHeight } from '../../../base/styles/functions.web';
import {
    ACTION_TRIGGER,
    type ActionTrigger,
    AudioStateIcons,
    MEDIA_STATE,
    MediaState,
    VideoStateIcons
} from '../../constants';

import { RaisedHandIndicator } from './RaisedHandIndicator';

import { IReduxState } from '../../../app/types';

interface IProps extends WithTranslation {

    /**
     * Type of trigger for the participant actions.
     */
    actionsTrigger?: ActionTrigger;

    /**
     * Media state for audio.
     */
    audioMediaState?: MediaState;

    /**
     * React children.
     */
    children?: ReactElement | boolean;

    /**
     * Whether or not to disable the moderator indicator.
     */
    disableModeratorIndicator?: boolean;

    /**
     * The name of the participant. Used for showing lobby names.
     */
    displayName?: string;

    /**
     * Is this item highlighted/raised.
     */
    isHighlighted?: boolean;

    /**
     * Whether or not the participant is a moderator.
     */
    isModerator?: boolean;

    /**
     * True if the participant is local.
     */
    local?: boolean;

    /**
     * Callback for when the mouse leaves this component.
     */
    onLeave?: (e?: React.MouseEvent) => void;

    /**
     * Opens a drawer with participant actions.
     */
    openDrawerForParticipant?: Function;

    /**
     * If an overflow drawer can be opened.
     */
    overflowDrawer?: boolean;

    /**
     * The ID of the participant.
     */
    participantID: string;

    /**
     * True if the participant have raised hand.
     */
    raisedHand?: boolean;

    /**
     * Media state for video.
     */
    videoMediaState?: MediaState;

    /**
     * The translated "you" text.
     */
    youText?: string;
    
}

const useStyles = makeStyles()((theme: Theme) => {
    return {
        nameContainer: {
            display: 'flex',
            flex: 1,
            overflow: 'hidden'
        },

        name: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },

        moderatorLabel: {
            ...withPixelLineHeight(theme.typography.labelRegular),
            color: theme.palette.text03
        }
    };
});

/**
 * A component representing a participant entry in ParticipantPane and Lobby.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactNode}
 */
function ParticipantItem({
    actionsTrigger = ACTION_TRIGGER.HOVER,
    audioMediaState = MEDIA_STATE.NONE,
    children,
    disableModeratorIndicator,
    displayName,
    isHighlighted,
    isModerator,
    local,
    onLeave,
    openDrawerForParticipant,
    overflowDrawer,
    participantID,
    raisedHand,
    t,
    videoMediaState = MEDIA_STATE.NONE,
    youText,
}: IProps) {

    const _attendeeInfo : IAttendeeInfo | undefined = useSelector((state: IReduxState )=> state['features/base/app'].attendeeInfo)
    const onClick = useCallback(
        () => openDrawerForParticipant?.({
            participantID,
            displayName
        }), []);

    const [userName, userType] = displayName!.split('|');
    const { classes: styles } = useStyles();

    const icon = (
        <Avatar
            className = 'participant-avatar'
            displayName = { userName }
            participantId = { participantID }
            size = { 32 } />
    );

    const text = (
        <>
            <div className = { styles.nameContainer }>
                <div className = { styles.name }>
                    {userName}
                </div>
                {local ? <span>&nbsp;({youText})</span> : null}
            </div>
            {
            //     _attendeeInfo?.userType === UserType.Admin
            //     &&
            // isModerator && !disableModeratorIndicator
            //     && 
            userType === UserType.Admin &&
                <div id={participantID} data-mute="true"  data-screenshare="true" className = { styles.moderatorLabel }>
                {t('videothumbnail.moderator')}
            </div>}
            { 
            userType === UserType.Presenter &&
                <div id={participantID} data-mute="true" data-screenshare="true" className = { styles.moderatorLabel }>
                Host
            </div>}
            { 
            userType === UserType.Viewer &&
                <div id={participantID}   className = { styles.moderatorLabel }  data-screenshare="false" data-mute="false">

{/* <div id={participantID}  className = { styles.moderatorLabel }> */}

                Participant
            </div>}
        </>
    );

    const indicators = (
        <>
            {raisedHand && <RaisedHandIndicator />}
            {VideoStateIcons[videoMediaState]}
            {AudioStateIcons[audioMediaState]}
        </>
    );

    return (
        <ListItem
            actions = { children }
            hideActions = { local }
            icon = { icon }
            id = { `participant-item-${participantID}` }
            indicators = { indicators }
            isHighlighted = { isHighlighted }
            onClick = { !local && overflowDrawer ? onClick : undefined }
            onMouseLeave = { onLeave }
            textChildren = { text }
            trigger = { actionsTrigger } />
    );
}

export default translate(ParticipantItem);
