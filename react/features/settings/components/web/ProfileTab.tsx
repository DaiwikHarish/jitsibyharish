/* eslint-disable lines-around-comment */
import React from 'react';
import { WithTranslation } from 'react-i18next';

// @ts-expect-error
import UIEvents from '../../../../../service/UI/UIEvents';
import { createProfilePanelButtonEvent } from '../../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../../analytics/functions';
import { connect } from '../../../base/redux/functions';
// @ts-ignore
import { AbstractDialogTab } from '../../../base/dialog';
// @ts-ignore
import type { Props as AbstractDialogTabProps } from '../../../base/dialog';
import { translate } from '../../../base/i18n/functions';
import Button from '../../../base/ui/components/web/Button';
import Input from '../../../base/ui/components/web/Input';
// @ts-ignore
import { openLogoutDialog } from '../../actions';
import { IAttendeeInfo} from '../../../base/app/types';
import { IReduxState } from '../../../app/types';

/**
 * The type of the React {@code Component} props of {@link ProfileTab}.
 */
export type Props = AbstractDialogTabProps & WithTranslation & {

    _attendeeInfo:IAttendeeInfo;

    /**
     * Whether or not server-side authentication is available.
     */
    authEnabled: boolean;

    /**
     * The name of the currently (server-side) authenticated user.
     */
    authLogin: string;

    /**
     * The display name to display for the local participant.
     */
    displayName: string;

    /**
     * The email to display for the local participant.
     */
    email: string;

    /**
     * Whether to hide the email input in the profile settings.
     */
    hideEmailInSettings?: boolean;

    /**
     * If the display name is read only.
     */
    readOnlyName: boolean;

    /**
     * Invoked to obtain translated strings.
     */
    t: Function;
};

/**
 * React {@code Component} for modifying the local user's profile.
 *
 * @augments Component
 */
class ProfileTab extends AbstractDialogTab<Props> {
    static defaultProps = {
        displayName: '',
        email: ''
    };

    /**
     * Initializes a new {@code ConnectedSettingsDialog} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code ConnectedSettingsDialog} instance with.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._onAuthToggle = this._onAuthToggle.bind(this);
        this._onDisplayNameChange = this._onDisplayNameChange.bind(this);
        this._onEmailChange = this._onEmailChange.bind(this);
    }

    /**
     * Changes display name of the user.
     *
     * @param {string} value - The key event to handle.
     *
     * @returns {void}
     */
    _onDisplayNameChange(value: string) {
        super._onChange({ displayName: value });
    }

    /**
     * Changes email of the user.
     *
     * @param {string} value - The key event to handle.
     *
     * @returns {void}
     */
    _onEmailChange(value: string) {
        super._onChange({ email: value });
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            authEnabled,
            displayName,
            email,
            hideEmailInSettings,
            readOnlyName,
            t ,
            _attendeeInfo
            // @ts-ignore,
        } = this.props;

        const [userName, userType] = displayName?.split('|');

        return (
            <div>
                <div className = 'profile-edit'>
                    <div className = 'profile-edit-field'>
                        <Input
                            readOnly={true}
                            id = 'setDisplayName'
                            label = { 'Displayed Name' }
                            name = 'name'
                            onChange = { this._onDisplayNameChange }
                            placeholder = { t('settings.name') }
                            type = 'text'
                            value = { userName } />
                    </div>
                    {!hideEmailInSettings && <div className = 'profile-edit-field'>
                        <Input
                            readOnly={true}
                            id = 'setEmail'
                            label = { 'Displayed Email' }
                            name = 'email'
                            onChange = { this._onEmailChange }
                            placeholder = { t('profile.setEmailInput') }
                            type = 'text'
                            value = { _attendeeInfo.emailId } />
                    </div>}
                </div>
                { authEnabled && this._renderAuth() }
            </div>
        );
    }

    /**
     * Shows the dialog for logging in or out of a server and closes this
     * dialog.
     *
     * @private
     * @returns {void}
     */
    _onAuthToggle() {
        // @ts-ignore
        if (this.props.authLogin) {
            sendAnalytics(createProfilePanelButtonEvent('logout.button'));

            APP.store.dispatch(openLogoutDialog(
                () => APP.UI.emitEvent(UIEvents.LOGOUT)
            ));
        } else {
            sendAnalytics(createProfilePanelButtonEvent('login.button'));

            APP.UI.emitEvent(UIEvents.AUTH_CLICKED);
        }
    }

    /**
     * Returns a React Element for interacting with server-side authentication.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderAuth() {
        const {
            authLogin,
            t
            // @ts-ignore
        } = this.props;

        return (
            <div>
                <h2 className = 'mock-atlaskit-label'>
                    { t('toolbar.authenticate') }
                </h2>
                { authLogin
                    && <div className = 'auth-name'>
                        { t('settings.loggedIn', { name: authLogin }) }
                    </div> }
                <Button
                    accessibilityLabel = { authLogin ? t('toolbar.logout') : t('toolbar.login') }
                    id = 'login_button'
                    label = { authLogin ? t('toolbar.logout') : t('toolbar.login') }
                    onClick = { this._onAuthToggle } />
            </div>
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
 export function _mapStateToProps(state: IReduxState) {
    return {
        _attendeeInfo: state["features/base/app"].attendeeInfo
    };
}


// @ts-ignore
// export default translate(ProfileTab);
export default translate(connect(_mapStateToProps)(ProfileTab));
