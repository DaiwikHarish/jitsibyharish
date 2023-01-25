/* eslint-disable lines-around-comment */

import { Theme } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../../app/types';
import { IAttendeeInfo } from '../../../base/app/types';
import { isDisplayNameVisible } from '../../../base/config/functions.any';
import {
    getLocalParticipant,
    getParticipantDisplayName,
    isWhiteboardParticipant
} from '../../../base/participants/functions';
import { IParticipant } from '../../../base/participants/types';
import { withPixelLineHeight } from '../../../base/styles/functions.web';
// @ts-ignore
import { getLargeVideoParticipant } from '../../../large-video/functions';
import { isToolboxVisible } from '../../../toolbox/functions.web';
// @ts-ignore
import { isLayoutTileView } from '../../../video-layout';

import DisplayNameBadge from './DisplayNameBadge';

const useStyles = makeStyles()((theme: Theme) => {
    return {
        badgeContainer: {
            ...withPixelLineHeight(theme.typography.bodyShortRegularLarge),
            alignItems: 'center',
            display: 'inline-flex',
            justifyContent: 'center',
            marginBottom: theme.spacing(7),
            transition: 'margin-bottom 0.3s',
            pointerEvents: 'none',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1
        },
        containerElevated: {
            marginBottom: theme.spacing(12)
        }
    };
});

/**
 * Component that renders the dominant speaker's name as a badge above the toolbar in stage view.
 *
 * @returns {ReactElement|null}
 */
const StageParticipantNameLabel = () => {
    const { classes, cx } = useStyles();
    const largeVideoParticipant: IParticipant = useSelector(getLargeVideoParticipant);
    const selectedId = largeVideoParticipant?.id;
    const nameToDisplay = useSelector((state: IReduxState) => getParticipantDisplayName(state, selectedId));
    const [userName, userType] = nameToDisplay?.split('|');

    const localParticipant = useSelector(getLocalParticipant);
    const localId = localParticipant?.id;

    const isTileView = useSelector(isLayoutTileView);
    const toolboxVisible: boolean = useSelector(isToolboxVisible);
    const showDisplayName = useSelector(isDisplayNameVisible);

    if (showDisplayName
        && userName
        && selectedId !== localId
        && !isTileView
        && !isWhiteboardParticipant(largeVideoParticipant)
    ) {
        return (
            <div
                className = { cx(
                    'stage-participant-label',
                    classes.badgeContainer,
                    toolboxVisible && classes.containerElevated
                ) }>
                <DisplayNameBadge name = { userName } />
            </div>
        );
    }

    return null;
};

export default StageParticipantNameLabel;
