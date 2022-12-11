// @flow

import { Component } from 'react';
import type { Dispatch } from 'redux';

import { getLocalParticipant } from '../../base/participants';
import { sendMessage, setIsPollsTabFocused } from '../actions';
import { SMALL_WIDTH_THRESHOLD } from '../constants';

/**
 * The type of the React {@code Component} props of {@code AbstractChat}.
 */
export type Props = {

    /**
     * Whether the chat is opened in a modal or not (computed based on window width).
     */
    _isModal: boolean,

    /**
     * True if the chat window should be rendered.
     */
    _isOpen: boolean,

    /**
     * True if the polls feature is enabled.
     */
    _isPollsEnabled: boolean,

    /**
     * Whether the poll tab is focused or not.
     */
    _isPollsTabFocused: boolean,
    _isQaTabFocused:boolean,
    /**
     * All the chat messagesQa in the conference.
     */
    _messagesQa: Array<Object>,

    /**
     * Number of unread chat messagesQa.
     */
    _nbUnreadMessages: number,

    /**
     * Number of unread poll messagesQa.
     */
    _nbUnreadPolls: number,

    /**
     * Function to send a text message.
     *
     * @protected
     */
    _onSendMessageQa: Function,

    /**
     * Function to display the chat tab.
     *
     * @protected
     */
    _onToggleChatTab: Function,
    _onToggleQATab: Function,
    /**
     * Function to display the polls tab.
     *
     * @protected
     */
    _onTogglePollsTab: Function,

    /**
     * Function to toggle the chat window.
     */
    _onToggleChat: Function,

    /**
     * Whether or not to block chat access with a nickname input form.
     */
    _showNamePrompt: boolean,

    /**
     * The Redux dispatch function.
     */
    dispatch: Dispatch<any>,

    /**
     * Function to be used to translate i18n labels.
     */
    t: Function,
};

/**
 * Implements an abstract chat panel.
 */
export default class AbstractChat<P: Props> extends Component<P> {

    /**
     * Initializes a new {@code AbstractChat} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code AbstractChat} instance with.
     */
    constructor(props: P) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onSendMessageQa = this._onSendMessageQa.bind(this);
        this._onToggleChatTab = this._onToggleChatTab.bind(this);

        this._onToggleQATab = this._onToggleQATab.bind(this);
        this._onTogglePollsTab = this._onTogglePollsTab.bind(this);
    }

    _onSendMessageQa: (string) => void;

    /**
    * Sends a text message.
    *
    * @private
    * @param {string} text - The text message to be sent.
    * @returns {void}
    * @type {Function}
    */
    _onSendMessageQa(text: string) {
        this.props.dispatch(sendMessage(text));
    }

    _onToggleChatTab: () => void;


    _onToggleQATab: () => void;
    /**
     * Display the Chat tab.
     *
     * @private
     * @returns {void}
     */
    _onToggleChatTab() {
        this.props.dispatch(setIsPollsTabFocused(false));
        //this.props.dispatch(setIsQATabFocused(false));
    }

    _onToggleQATab() {
        this.props.dispatch(setIsPollsTabFocused(false));
       // this.props.dispatch(setIsQATabFocused(true));
    }

    _onTogglePollsTab: () => void;

    /**
     * Display the Polls tab.
     *
     * @private
     * @returns {void}
     */
    _onTogglePollsTab() {
        this.props.dispatch(setIsPollsTabFocused(true));
      //  this.props.dispatch(setIsQATabFocused(false));
    }
}

/**
 * Maps (parts of) the redux state to {@link Chat} React {@code Component}
 * props.
 *
 * displayName: "Presenter 1|Presenter"
error: undefined
id: "7874d6d8"
isReaction: false
lobbyChat: false
message: "asdfsadf"
messageId: "7f3e36cb-cc8e-4c5b-89bf-dd5f432e7e9e"
messageType: "local" | "remote"
privateMessage: false
recipient: "Presenter 1|Presenter"
timestamp: 1670432204381
 * 
 * 
 * API -
 * createdAt: "2022-08-22T13:34:56.924Z"
fromUserId: "4"
fromUserName: "Admin 4"
fromUserType: "Admin"
id: 1
meetingId: 1
message: "Hii"
toUserId: "165"
toUserName: "Viewer 165"
toUserType: "Viewer"
updatedAt: "2022-08-22T13:34:56.924Z"
 * @param {Object} state - The redux store/state.
 * @private
 * @returns {{
 *     _isOpen: boolean,
 *     _messagesQa: Array<Object>,
 *     _showNamePrompt: boolean
 * }}
 */
export function _mapStateToProps(state: Object) {
    const { isOpen, isPollsTabFocused,isQaTabFocused, messagesQa, nbUnreadMessages } = state['features/chat'];
    const { nbUnreadPolls } = state['features/polls'];
    const _localParticipant = getLocalParticipant(state);
    const { disablePolls } = state['features/base/config'];


return {
    _isModal: window.innerWidth <= SMALL_WIDTH_THRESHOLD,
    _isOpen: isOpen,
    _isPollsEnabled: !disablePolls,
    _isPollsTabFocused: isPollsTabFocused,
    _isQaTabFocused: false,
    
    _messagesQa: messagesQa,
    _nbUnreadMessages: nbUnreadMessages,
    _nbUnreadPolls: nbUnreadPolls,
    _showNamePrompt: !_localParticipant?.name
};





}
