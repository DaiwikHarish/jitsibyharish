// @flow

import InlineDialog from '@atlaskit/inline-dialog';
import React, { Component } from 'react';

import { Avatar } from '../../../base/avatar';
import { isNameReadOnly } from '../../../base/config';
import { translate } from '../../../base/i18n';
import { IconArrowDown, IconArrowUp, IconPhone, IconVolumeOff } from '../../../base/icons';
import { isVideoMutedByUser } from '../../../base/media';
import { getLocalParticipant } from '../../../base/participants';
import { ActionButton, InputField, PreMeetingScreen } from '../../../base/premeeting';
import { connect } from '../../../base/redux';
import { getDisplayName, updateSettings } from '../../../base/settings';
import { getLocalJitsiVideoTrack } from '../../../base/tracks';
import { ApiConstants } from '../../../../../ApiConstants';
import { ApplicationConstants } from '../../../../../ApplicationConstants';
import {
    joinConference as joinConferenceAction,
    joinConferenceWithoutAudio as joinConferenceWithoutAudioAction,
    setJoinByPhoneDialogVisiblity as setJoinByPhoneDialogVisiblityAction
} from '../../actions';
import {
    isDeviceStatusVisible,
    isDisplayNameRequired,
    isJoinByPhoneButtonVisible,
    isJoinByPhoneDialogVisible,
    isPrejoinDisplayNameVisible
} from '../../functions';

import DropdownButton from './DropdownButton';
import JoinByPhoneDialog from './dialogs/JoinByPhoneDialog';
import PostWelcome from '../../../base/post-welcome-page/PostWelcome';
import { OptionType } from '../../../base/app/reducer';
import {IAttendeeInfo,IUrlInfo,IMeetingInfo} from '../../../base/app/types'
import { appAttendeeInfo, appClientType, appMeetingInfo} from '../../../base/app/actions';
import { muteAllParticipants } from '../../../video-menu/actions.any';
import { MEDIA_TYPE } from '../../../base/media/constants';

function storeMeetingInfo(meeting:IMeetingInfo){
    return(dispatch)=>{
        dispatch(appMeetingInfo(meeting))
    }
}


function storeAttendeeInfo(attendee:IAttendeeInfo){
    return(dispatch)=>{
        dispatch(appAttendeeInfo(attendee))
    }
}

type Props = {

    _userId:String,

    /**
     * Type of url params.
     */
    _urlInfo:IUrlInfo,

    /**
     * Type of Attendee details.
     */
    _attendeeInfo:IAttendeeInfo,

    /**
     * Indicates whether the display  name is editable.
     */
    canEditDisplayName: boolean,

    /**
     * Flag signaling if the device status is visible or not.
     */
    deviceStatusVisible: boolean,

    /**
     * If join by phone button should be visible.
     */
    hasJoinByPhoneButton: boolean,

    /**
     * Joins the current meeting.
     */
    joinConference: Function,

    /**
     * Joins the current meeting without audio.
     */
    joinConferenceWithoutAudio: Function,

    /**
     * The name of the user that is about to join.
     */
    name: string,

    /**
     * Updates settings.
     */
    updateSettings: Function,

    /**
     * Local participant id.
     */
    participantId: string,

    /**
     * The prejoin config.
     */
    prejoinConfig?: Object,

    /**
     * Whether the name input should be read only or not.
     */
    readOnlyName: boolean,

    /**
     * Sets visibility of the 'JoinByPhoneDialog'.
     */
    setJoinByPhoneDialogVisiblity: Function,

    /**
     * Flag signaling the visibility of camera preview.
     */
    showCameraPreview: boolean,

    /**
     * If should show an error when joining without a name.
     */
    showErrorOnJoin: boolean,

    /**
     * If 'JoinByPhoneDialog' is visible or not.
     */
    showDialog: boolean,

    /**
     * Used for translation.
     */
    t: Function,

    /**
     * The JitsiLocalTrack to display.
     */
    videoTrack: ?Object
};

type State = {

    /**
     * Flag controlling the visibility of the error label.
     */
    showError: boolean,

    /**
     * Flag controlling the visibility of the 'join by phone' buttons.
     */
    showJoinByPhoneButtons: boolean
}
/**
 * This component is displayed before joining a meeting.
 */
class Prejoin extends Component<Props, State> {
    /**
     * Initializes a new {@code Prejoin} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state = {
            showError: false,
            showJoinByPhoneButtons: false,
            clickStartBtn : false,
            loading: true
        };

        this._closeDialog = this._closeDialog.bind(this);
        this._showDialog = this._showDialog.bind(this);
        this._onJoinButtonClick = this._onJoinButtonClick.bind(this);
        this._onDropdownClose = this._onDropdownClose.bind(this);
        this._onOptionsClick = this._onOptionsClick.bind(this);
        this._setName = this._setName.bind(this);
        this._onJoinConferenceWithoutAudioKeyPress = this._onJoinConferenceWithoutAudioKeyPress.bind(this);
        this._showDialogKeyPress = this._showDialogKeyPress.bind(this);
        this._onJoinKeyPress = this._onJoinKeyPress.bind(this);
        this._getExtraJoinButtons = this._getExtraJoinButtons.bind(this);
        this.clickHandler = this.clickHandler.bind(this);

        this.showDisplayNameField = props.canEditDisplayName || props.showErrorOnJoin;
    }
    _onJoinButtonClick: () => void;

    clickHandler() {
        this.setState({clickStartBtn:true });

    };
    /**
     * Handler for the join button.
     *
     * @param {Object} e - The synthetic event.
     * @returns {void}
     */
    _onJoinButtonClick() {
        if (this.props.showErrorOnJoin) {
            this.setState({
                showError: true
            });

            return;
        }

        this.setState({ showError: false });
        this.props.joinConference();
    }

    _onJoinKeyPress: (Object) => void;

    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onJoinKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._onJoinButtonClick();
        }
    }

    _onDropdownClose: () => void;

    /**
     * Closes the dropdown.
     *
     * @returns {void}
     */
    _onDropdownClose() {
        this.setState({
            showJoinByPhoneButtons: false
        });
    }

    _onOptionsClick: () => void;

    /**
     * Displays the join by phone buttons dropdown.
     *
     * @param {Object} e - The synthetic event.
     * @returns {void}
     */
    _onOptionsClick(e) {
        e.stopPropagation();

        this.setState({
            showJoinByPhoneButtons: !this.state.showJoinByPhoneButtons
        });
    }

    _setName: () => void;

    /**
     * Sets the guest participant name.
     *
     * @param {string} displayName - Participant name.
     * @returns {void}
     */
    _setName(displayName) {
        this.props.updateSettings({
            displayName
        });
    }

    _closeDialog: () => void;

    /**
     * Closes the join by phone dialog.
     *
     * @returns {undefined}
     */
    _closeDialog() {
        this.props.setJoinByPhoneDialogVisiblity(false);
    }

    _showDialog: () => void;

    /**
     * Displays the dialog for joining a meeting by phone.
     *
     * @returns {undefined}
     */
    _showDialog() {
        this.props.setJoinByPhoneDialogVisiblity(true);
        this._onDropdownClose();
    }

    _showDialogKeyPress: (Object) => void;

    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _showDialogKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._showDialog();
        }
    }

    _onJoinConferenceWithoutAudioKeyPress: (Object) => void;

    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onJoinConferenceWithoutAudioKeyPress(e) {
        if (this.props.joinConferenceWithoutAudio
            && (e.key === ' '
                || e.key === 'Enter')) {
            e.preventDefault();
            this.props.joinConferenceWithoutAudio();
        }
    }

    _getExtraJoinButtons: () => Object;

    /**
     * Gets the list of extra join buttons.
     *
     * @returns {Object} - The list of extra buttons.
     */
    _getExtraJoinButtons() {
        const { joinConferenceWithoutAudio, t } = this.props;

        const noAudio = {
            key: 'no-audio',
            dataTestId: 'prejoin.joinWithoutAudio',
            icon: IconVolumeOff,
            label: t('prejoin.joinWithoutAudio'),
            onButtonClick: joinConferenceWithoutAudio,
            onKeyPressed: this._onJoinConferenceWithoutAudioKeyPress
        };

        const byPhone = {
            key: 'by-phone',
            dataTestId: 'prejoin.joinByPhone',
            icon: IconPhone,
            label: t('prejoin.joinAudioByPhone'),
            onButtonClick: this._showDialog,
            onKeyPressed: this._showDialogKeyPress
        };

        return {
            noAudio,
            byPhone
        };
    }

    /**
     * Fetching attendee API.
     */
    _fetchAttendees = async (meetingId, userId) => {
        
        if (
            meetingId === null ||
            meetingId === undefined ||
            meetingId === '' ||
            meetingId === '' ||
            userId === null ||
            userId === undefined ||
            userId === '' ||
            userId === ''
        ) {
            return;
        }

        this.setState({loading:true});
    
        fetch(
            ApiConstants.attendee+"?meetingId="+ApplicationConstants.meetingId+"&userId="+ApplicationConstants.userId     )
            .then((response) => response.json())
            .then((data) => {
                const attendee: IAttendeeInfo = data[0];
                this.props.storeAttendeeInfo(attendee)
                this._setName(
                    attendee.userName +
                        '|' +
                        attendee.userType +
                        '|' +
                        attendee.userId
                );
                this.setState({loading:false});
            })
            .catch((err) => {
                console.log(err.message);
            })
        };
    
    /**
     * Fetching meeting API.
     */
    _fetchMeetings = async  (meetingId) =>{

        if(
            meetingId === null || 
            meetingId === undefined || 
            meetingId === "" || 
            meetingId === ''){
                return;
            }

        this.setState({loading:true});
            fetch(
                //'https://dev.awesomereviewstream.com/svr/api' + '/' +`meeting?meetingId=${meetingId}&includeAttendee=false`
           
                ApiConstants.meeting+'&includeAttendee=false'
           
                )
                .then((response) => response.json())
                .then((data) => {
                    const meeting: IMeetingInfo =data[0];
                    this.props.storeMeetingInfo(meeting)
                    this.setState({loading:false});
                })
                .catch((err) => {
                    console.log(err.message);
                })
            };

    /**
     * Calling attendee and meeting api on first rendering of this component.
     */
    componentDidMount() {

        const meetingId = this.props._urlInfo.meetingId;
        const userId = this.props._urlInfo.userId;

        if(this.props._storeAttendeeInfo === undefined ){
            this._fetchAttendees(meetingId, userId);
        }

        if(this.props._storeAttendeeInfo === undefined ){
            this._fetchMeetings(meetingId)
        }

    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            deviceStatusVisible,
            hasJoinByPhoneButton,
            joinConference,
            joinConferenceWithoutAudio,
            name,
            participantId,
            prejoinConfig,
            readOnlyName,
            showCameraPreview,
            showDialog,
            t,
            
            videoTrack,
            _attendeeInfo,
            _clientType
        } = this.props;



        const { _closeDialog, _onDropdownClose, _onJoinButtonClick, _onJoinKeyPress,
            _onOptionsClick, _setName } = this;
            const [userName, userType,userId] = name.split('|');
        const extraJoinButtons = this._getExtraJoinButtons();
        let extraButtonsToRender = Object.values(extraJoinButtons).filter((val: Object) =>
            !(prejoinConfig?.hideExtraJoinButtons || []).includes(val.key)
        );

        if (!hasJoinByPhoneButton) {
            extraButtonsToRender = extraButtonsToRender.filter((btn: Object) => btn.key !== 'by-phone');
        }
        const hasExtraJoinButtons = Boolean(extraButtonsToRender.length);
        const { showJoinByPhoneButtons, showError } = this.state;

        return (
            <PreMeetingScreen
                showDeviceStatus = { deviceStatusVisible }
                title = { t('prejoin.joinMeeting') }
                videoMuted = { _clientType === OptionType.ENABLE_ALL? false : true }
                videoTrack = { _clientType === OptionType.ENABLE_ALL? videoTrack : {} }
                clickStartBtn={this.state.clickStartBtn}
                loading={this.state.loading}
                >
                {this.state.clickStartBtn == false ? (
                    <PostWelcome onStart={this.clickHandler}/> 
                    ) : (  
                    <div
                        className = 'prejoin-input-area'
                        data-testid = 'prejoin.screen'>
                        {this.showDisplayNameField ? (<InputField
                        autoComplete = { 'name' }
                        autoFocus = { true }
                        className = { showError ? 'error' : '' }
                        hasError = { showError }
                        onChange = { _setName }
                        onSubmit = { joinConference }
                        placeHolder = { t('dialog.enterDisplayName') }
                        readOnly = { true }
                        value = { userName } />
                    ) : (
                        <div className = 'prejoin-avatar-container'>
                            <Avatar
                                className = 'prejoin-avatar'
                                displayName = { userName }
                                participantId = { participantId }
                                size = { 72 } />
                            <div className = 'prejoin-avatar-name'>{userName}</div>
                        </div>
                    )}

                    {showError && <div
                        className = 'prejoin-error'
                        data-testid = 'prejoin.errorMessage'>{t('prejoin.errorMissingName')}</div>}

                    <div className = 'prejoin-preview-dropdown-container'>
                        <InlineDialog
                            content = { hasExtraJoinButtons && <div className = 'prejoin-preview-dropdown-btns'>
                                {extraButtonsToRender.map(({ key, ...rest }: Object) => (
                                    <DropdownButton
                                        key = { key }
                                        { ...rest } />
                                ))}
                            </div> }
                            isOpen = { showJoinByPhoneButtons }
                            onClose = { _onDropdownClose }>
                            <ActionButton
                                OptionsIcon = { showJoinByPhoneButtons ? IconArrowUp : IconArrowDown }
                                ariaDropDownLabel = { t('prejoin.joinWithoutAudio') }
                                ariaLabel = { t('prejoin.joinMeeting') }
                                ariaPressed = { showJoinByPhoneButtons }
                                hasOptions = { hasExtraJoinButtons }
                                onClick = { _onJoinButtonClick }
                                onKeyPress = { _onJoinKeyPress }
                                onOptionsClick = { _onOptionsClick }
                                role = 'button'
                                tabIndex = { 0 }
                                testId = 'prejoin.joinMeeting'
                                type = 'primary'>
                                { t('prejoin.joinMeeting') }
                            </ActionButton>
                        </InlineDialog>
                    </div>
                </div>)}
                { showDialog && (
                    <JoinByPhoneDialog
                        joinConferenceWithoutAudio = { joinConferenceWithoutAudio }
                        onClose = { _closeDialog } />
                )}
            </PreMeetingScreen>
        );
    }
}

/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
function mapStateToProps(state): Object {
    const name = getDisplayName(state);
    const showErrorOnJoin = isDisplayNameRequired(state) && !name;
    const { id: participantId } = getLocalParticipant(state);

    return {
        canEditDisplayName: isPrejoinDisplayNameVisible(state),
        deviceStatusVisible: isDeviceStatusVisible(state),
        hasJoinByPhoneButton: isJoinByPhoneButtonVisible(state),
        name,
        participantId,
        prejoinConfig: state['features/base/config'].prejoinConfig,
        readOnlyName: isNameReadOnly(state),
        showCameraPreview: !isVideoMutedByUser(state),
        showDialog: isJoinByPhoneDialogVisible(state),
        showErrorOnJoin,
        videoTrack: getLocalJitsiVideoTrack(state),
        _attendeeInfo: state["features/base/app"].attendeeInfo,
        _urlInfo: state["features/base/app"].urlInfo,
        _clientType: state["features/base/app"].clientType,
        _userId:state['features/base/settings'].userId
    };
}

const mapDispatchToProps = {
    joinConferenceWithoutAudio: joinConferenceWithoutAudioAction,
    joinConference: joinConferenceAction,
    setJoinByPhoneDialogVisiblity: setJoinByPhoneDialogVisiblityAction,
    updateSettings,
    storeAttendeeInfo,
    storeMeetingInfo,
    
};

export default connect(mapStateToProps, mapDispatchToProps)(translate(Prejoin));
