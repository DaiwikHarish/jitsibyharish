/* @flow */

import React from 'react';

import { translate } from '../../../base/i18n';
import { IconShareDesktop } from '../../../base/icons';
import { connect } from '../../../base/redux';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';


import UserType from "../../../base/app/types"

/**
 * Implements a React {@link Component} which displays a button for kicking out
 * a participant from the conference.
 *
 * NOTE: At the time of writing this is a button that doesn't use the
 * {@code AbstractButton} base component, but is inherited from the same
 * super class ({@code AbstractKickButton} that extends {@code AbstractButton})
 * for the sake of code sharing between web and mobile. Once web uses the
 * {@code AbstractButton} base component, this can be fully removed.
 */
class ShareButtonDisable  extends React.Component{
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

    
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { participantID, t, _attendeeInfo } = this.props;

        return (
            _attendeeInfo.userType === UserType.Admin &&
            <ContextMenuItem
            accessibilityLabel = "Disable ScreenShare"
            className = 'kicklink'
            icon = { IconShareDesktop }
            id = { `ejectlink_${participantID}` }
            // eslint-disable-next-line react/jsx-handler-names
            onClick={(e) =>  {alert(e.target.value) }}
            text = "Disable ScreenShare"/>
        );
    }

    
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
export default translate(connect(_mapStateToProps)(ShareButtonDisable));
