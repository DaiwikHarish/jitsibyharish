// @flow

import React, { Fragment } from 'react';

import { APP_USER_INFO, BaseApp } from '../../base/app';
import { toURLString } from '../../base/util';
import { OverlayContainer } from '../../overlay';
import { appNavigate } from '../actions';
import { getDefaultURL } from '../functions';
import { IUserInfo } from '../../base/app/types';

import { parseURIString } from '../../base/util'; 
/**
 * The type of React {@code Component} props of {@link AbstractApp}.
 */
export type Props = {

    /**
     * XXX Refer to the implementation of loadURLObject: in
     * ios/sdk/src/JitsiMeetView.m for further information.
     */
    timestamp: any,

    /**
     * The URL, if any, with which the app was launched.
     */
    url: Object | string
};

/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export class AbstractApp extends BaseApp<Props, *> {
    /**
     * The deferred for the initialisation {{promise, resolve, reject}}.
     */
    _init: Object;

    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    async componentDidMount() {
        await super.componentDidMount();

        // If a URL was explicitly specified to this React Component, then
        // open it; otherwise, use a default.
        this._openURL(toURLString(this.props.url) || this._getDefaultURL());
    }

    /**
     * Implements React Component's componentDidUpdate.
     *
     * @inheritdoc
     */
    async componentDidUpdate(prevProps: Props) {
        const previousUrl = toURLString(prevProps.url);
        const currentUrl = toURLString(this.props.url);
        const previousTimestamp = prevProps.timestamp;
        const currentTimestamp = this.props.timestamp;

        await this._init.promise;

        // Deal with URL changes.

        if (previousUrl !== currentUrl

            // XXX Refer to the implementation of loadURLObject: in
            // ios/sdk/src/JitsiMeetView.m for further information.
            || previousTimestamp !== currentTimestamp) {
            this._openURL(currentUrl || this._getDefaultURL());
        }
    }

    /**
     * Creates an extra {@link ReactElement}s to be added (unconditionally)
     * alongside the main element.
     *
     * @abstract
     * @protected
     * @returns {ReactElement}
     */
    _createExtraElement() {
        return (
            <Fragment>
                <OverlayContainer />
            </Fragment>
        );
    }

    _createMainElement: (React$Element<*>, Object) => ?React$Element<*>;

    /**
     * Gets the default URL to be opened when this {@code App} mounts.
     *
     * @protected
     * @returns {string} The default URL to be opened when this {@code App}
     * mounts.
     */
    _getDefaultURL() {
        return getDefaultURL(this.state.store);
    }

    /**
     * Navigates this {@code AbstractApp} to (i.e. Opens) a specific URL.
     *
     * @param {Object|string} url - The URL to navigate this {@code AbstractApp}
     * to (i.e. The URL to open).
     * @protected
     * @returns {void}
     */
    _openURL(url) {

        let urlObject = parseURIString(url);
        console.log("JB this.props.location.search", urlObject);
        const query = new URLSearchParams(urlObject.search);
        const userType = query.get('userType');
        const userName = query.get('userName');
        const userId = query.get('userName');
        const meetingId = query.get('meetingId');
        const meetingName = query.get('meetingName');
        const emailId = query.get('emailId');
 
       let userInfo: IUserInfo = {
            userId: userId,
            userType: userType,
            userName: userName,
            emailId: emailId,
            meetingId:meetingId,
            meetingName: meetingName,
        };

        this.state.store.dispatch(appNavigate(toURLString(url)));
        this.state.store.dispatch({
            type: APP_USER_INFO,
            userInfo
        });
    }
}
