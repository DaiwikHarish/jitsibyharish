import { IStore } from '../app/types';
import { getCurrentConference } from '../base/conference/functions';
import { VIDEO_TYPE } from '../base/media/constants';
import { PARTICIPANT_LEFT, PIN_PARTICIPANT } from '../base/participants/actionTypes';
import { pinParticipant } from '../base/participants/actions';
import { getParticipantById, getPinnedParticipant } from '../base/participants/functions';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';
import StateListenerRegistry from '../base/redux/StateListenerRegistry';
import { TRACK_REMOVED } from '../base/tracks/actionTypes';
import { SET_DOCUMENT_EDITING_STATUS } from '../etherpad/actionTypes';
// eslint-disable-next-line lines-around-comment
// @ts-ignore
import { isStageFilmstripEnabled } from '../filmstrip/functions';
import { isFollowMeActive } from '../follow-me/functions';

import { SET_TILE_VIEW } from './actionTypes';
import { setRemoteParticipantsWithScreenShare, setTileView } from './actions';
import { getAutoPinSetting, updateAutoPinnedParticipant } from './functions';

import './subscriber';

let previousTileViewEnabled: boolean | undefined;

/**
 * Middleware which intercepts actions and updates tile view related state.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {

    // we want to extract the leaving participant and check its type before actually the participant being removed.
    let shouldUpdateAutoPin = false;

    switch (action.type) {
    case PARTICIPANT_LEFT: {
        if (!getAutoPinSetting() || isFollowMeActive(store)) {
            break;
        }
        shouldUpdateAutoPin = Boolean(getParticipantById(store.getState(), action.participant.id)?.fakeParticipant);
        break;
    }
    }

    const result = next(action);

    switch (action.type) {

    // Actions that temporarily clear the user preferred state of tile view,
    // then re-set it when needed.
    case PIN_PARTICIPANT: {
        const pinnedParticipant = getPinnedParticipant(store.getState());

        if (pinnedParticipant) {
            _storeTileViewStateAndClear(store);
        } else {
            _restoreTileViewState(store);
        }
        break;
    }
    case SET_DOCUMENT_EDITING_STATUS:
        if (action.editing) {
            _storeTileViewStateAndClear(store);
        } else {
            _restoreTileViewState(store);
        }
        break;

    // Things to update when tile view state changes
    case SET_TILE_VIEW: {
        const state = store.getState();
        const stageFilmstrip = isStageFilmstripEnabled(state);

        if (action.enabled && !stageFilmstrip && getPinnedParticipant(state)) {
            store.dispatch(pinParticipant(null));
        }
        break;
    }

    // Update the remoteScreenShares.
    // Because of the debounce in the subscriber which updates the remoteScreenShares we need to handle
    // removal of screen shares separately here. Otherwise it is possible to have screen sharing
    // participant that has already left in the remoteScreenShares array. This can lead to rendering
    // a thumbnails for already left participants since the remoteScreenShares array is used for
    // building the ordered list of remote participants.
    case TRACK_REMOVED: {
        const { jitsiTrack } = action.track;

        if (jitsiTrack?.isVideoTrack() && jitsiTrack?.getVideoType() === VIDEO_TYPE.DESKTOP) {
            const participantId = jitsiTrack.getParticipantId();
            const oldScreenShares = store.getState()['features/video-layout'].remoteScreenShares || [];
            const newScreenShares = oldScreenShares.filter(id => id !== participantId);

            if (oldScreenShares.length !== newScreenShares.length) { // the participant was removed
                store.dispatch(setRemoteParticipantsWithScreenShare(newScreenShares));

                updateAutoPinnedParticipant(oldScreenShares, store);
            }

        }

        break;
    }
    }

    if (shouldUpdateAutoPin) {
        const screenShares = store.getState()['features/video-layout'].remoteScreenShares || [];

        updateAutoPinnedParticipant(screenShares, store);
    }

    return result;
});

/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed.
 */
StateListenerRegistry.register(
    state => getCurrentConference(state),
    (conference, { dispatch }, previousConference) => {
        if (conference !== previousConference) {
            // conference changed, left or failed...
            // Clear tile view state.
            dispatch(setTileView());
        }
    });

/**
 * Restores tile view state, if it wasn't updated since then.
 *
 * @param {Object} store - The Redux Store.
 * @returns {void}
 */
function _restoreTileViewState({ dispatch, getState }: IStore) {
    const { tileViewEnabled } = getState()['features/video-layout'];

    if (tileViewEnabled === undefined && previousTileViewEnabled !== undefined) {
        dispatch(setTileView(previousTileViewEnabled));
    }

    previousTileViewEnabled = undefined;
}

/**
 * Stores the current tile view state and clears it.
 *
 * @param {Object} store - The Redux Store.
 * @returns {void}
 */
function _storeTileViewStateAndClear({ dispatch, getState }: IStore) {
    const { tileViewEnabled } = getState()['features/video-layout'];

    if (tileViewEnabled !== undefined) {
        previousTileViewEnabled = tileViewEnabled;
        dispatch(setTileView(undefined));
    }
}
