// @flow

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch,useSelector } from 'react-redux';

import { approveParticipant } from '../../../av-moderation/actions';
import { IconMicrophoneEmpty } from '../../../base/icons';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';
import { IReduxState } from '../../../app/types';
import UserType from '../../../base/app/types';

type Props = {

    /**
     * Whether or not the participant is audio force muted.
     */
    isAudioForceMuted: boolean,

    /**
     * Whether or not the participant is video force muted.
     */
    isVideoForceMuted: boolean,

    /**
     * The ID for the participant on which the button will act.
     */
    participantID: string
}

const AskToUnmuteButton = ({ isAudioForceMuted, isVideoForceMuted, participantID }: Props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const _onClick = useCallback(() => {
        dispatch(approveParticipant(participantID));
    }, [ participantID ]);
    const _attendeeInfo = useSelector((state:IReduxState)=>state["features/base/app"].attendeeInfo)


    const text = isAudioForceMuted || !isVideoForceMuted
        ? t('participantsPane.actions.askUnmute')
        : t('participantsPane.actions.allowVideo');

    return (
        _attendeeInfo?.userType !== UserType.Viewer &&
        <ContextMenuItem
            accessibilityLabel = { text }
            icon = { IconMicrophoneEmpty }
            onClick = { _onClick }
            text = { text } />
    );
};

export default AskToUnmuteButton;
