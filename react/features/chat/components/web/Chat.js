// @flow

import clsx from 'clsx';
import React from 'react';
import { isMobileBrowser } from '../../../base/environment/utils';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import Tabs from '../../../base/ui/components/web/Tabs';
// @ts-ignore
import { PollsPane } from '../../../polls/components';
import { setIsPollsTabFocused, toggleChat } from '../../actions.web';
import { CHAT_TABS } from '../../constants';
import AbstractChat, { type Props, _mapStateToProps } from '../AbstractChat';
import Input from '../../../base/ui/components/web/Input';
import Button from '../../../base/ui/components/web/Button';
import { IconPlane, IconSmile } from '../../../base/icons/svg';
import ChatHeader from './ChatHeader';
import { ApiConstants } from '../../../../../ApiConstants';
import { ApplicationConstants } from '../../../../../ApplicationConstants';
import DisplayNameForm from './DisplayNameForm';
import KeyboardAvoider from './KeyboardAvoider';
import MessageContainer from './MessageContainer';
import MessageRecipient from './MessageRecipient';

import MessageContainerQA from '../../../cs-qa-viewer/qa';
import { clearPolls } from '../../../polls/actions';

/**
 * React Component for holding the chat feature in a side panel that slides in
 * and out of view.
 */
class Chat extends AbstractChat<Props> {
    /**
     * Reference to the React Component for displaying chat messages. Used for
     * scrolling to the end of the chat messages.
     */
    _messageContainerRef: Object;

    /**
     * Initializes a new {@code Chat} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            chatCounter: 0,
            qaCounter: 0,
            pollCounter: 0,
            chatOpened: false,
            qaOpened: false,
            pollOpened: false,
            messageInput: '',

            allMes: [],
            QAtab: false,
        };
        this._messageContainerRef = React.createRef();

        // Bind event handlers so they are only bound once for every instance.
        this._onChatTabKeyDown = this._onChatTabKeyDown.bind(this);
        this._onEscClick = this._onEscClick.bind(this);
        this._onPollsTabKeyDown = this._onPollsTabKeyDown.bind(this);
        this._onToggleChat = this._onToggleChat.bind(this);
        this._onChangeTab = this._onChangeTab.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _isOpen, _isPollsEnabled, _showNamePrompt } = this.props;

        return _isOpen ? (
            <div
                className="sideToolbarContainer"
                id="sideToolbarContainer"
                onKeyDown={this._onEscClick}
            >
                <ChatHeader
                    className="chat-header"
                    id="chat-header"
                    isPollsEnabled={_isPollsEnabled}
                    onCancel={this._onToggleChat}
                />
                {_showNamePrompt ? (
                    <DisplayNameForm isPollsEnabled={_isPollsEnabled} />
                ) : (
                    this._renderChat()
                )}
            </div>
        ) : null;
    }
    componentDidMount() {
        this.getMessage();

        this.setState({ chatCounter: 0, chatOpened: true });
     this.props.dispatch(clearPolls())
     
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps._isPollsEnabled != this.props._isPollsEnabled) {
            
            if (this.props._isPollsEnabled == true) {
                this.setState({ pollCounter: 0 });
            }
        }

        if (prevProps._isOpen != this.props._isOpen) {
            if (this.state.allMes.length > 0) {
                if (this.props._isOpen) {
                    const chattab = document.getElementById('chat-tab');

                    if (chattab != null) {
                        chattab.style.display = 'flex';
                    }
                }
            }
        }

        if (
            this.props._socketQaMessage != '' &&
            this.props._socketQaMessage != null &&
            this.props._socketQaMessage != undefined
        ) {
            let hasNewMessages =
                this.props._socketQaMessage !== prevProps._socketQaMessage;

            if (hasNewMessages) {
                if (!this.state.qaOpened) {
                    let counter = this.state.qaCounter;
                    counter++;
                    this.setState({ qaCounter: counter });
                }
            }
        }

        if (
            this.props._socketPollStartMessage != '' &&
            this.props._socketPollStartMessage != null &&
            this.props._socketPollStartMessage != undefined
        ) {
            let hasNewMessages =
                this.props._socketPollStartMessage !==
                prevProps._socketPollStartMessage;

            if (hasNewMessages) {
                if (!this.state.pollOpened) {
                    let counter = this.state.pollCounter;
                    counter++;
                    this.setState({ pollCounter: counter });
                }
                if (this.props._isPollsTabFocused) {
                    this.setState({ pollCounter: 0 });
                }
            }
        }
        if (
            this.props._socketPollEndMessage != '' &&
            this.props._socketPollEndMessage != null &&
            this.props._socketPollEndMessage != undefined
        ) {
            let hasNewMessages =
                this.props._socketPollEndMessage !==
                prevProps._socketPollEndMessage;

            if (hasNewMessages) {
                if (!this.state.pollOpened) {
                    let counter = this.state.pollCounter;
                    counter++;
                    this.setState({ pollCounter: counter });
                }
                if (this.props._isPollsTabFocused) {
                    this.setState({ pollCounter: 0 });
                }
            }
        }

        if (
            this.props._socketChatMessage != '' &&
            this.props._socketChatMessage != null &&
            this.props._socketChatMessage != undefined
        ) {
            let hasNewMessagesChat =
                this.props._socketChatMessage !== prevProps._socketChatMessage;

            if (hasNewMessagesChat) {
                if (!this.state.chatOpened) {
                    let counter = this.state.chatCounter;
                    counter++;
                    this.setState({ chatCounter: counter });
                }

                let obj = [];
                obj = this.state.allMes;

                let usertype = 'local';

                if (
                    this.props._socketChatMessage.data.fromUserName !=
                    this.props._socketChatMessage.data.toUserName
                ) {
                    usertype = 'remote';
                }
                let socketObj = {
                    displayName:
                        this.props._socketChatMessage.data.fromUserName,

                    id: this.props._socketChatMessage.data.id,
                    isReaction: 'false',
                    lobbyChat: 'false',
                    message: this.props._socketChatMessage.data.message,
                    messageId: this.props._socketChatMessage.data.id,
                    messageType: usertype,
                    recipient: this.props._socketChatMessage.data.toUserName,
                    timestamp: new Date(
                        this.props._socketChatMessage.data.updatedAt
                    ).getTime(),
                };

                let allMes = obj.concat(socketObj);

                this.setState({ allMes: allMes });
                const chattab = document.getElementById('chat-tab');

                if (chattab != null) {
                    chattab.style.display = 'flex';
                }
            }
        }
    }

    getMessage() {
        if (
            ApplicationConstants.meetingId == undefined ||
            ApplicationConstants.meetingId == null
        ) {
            return;
        }

        fetch(ApiConstants.chat)
            .then((response) => response.json())
            .then((data) => {
                if (data.length >= 1) {
                    var allMes = data.map(
                        (mesAPI: {
                            fromUserName: any,
                            toUserName: any,
                            id: any,
                            message: any,
                            updatedAt: string | number | Date,
                        }) => {
                            let usertype = 'local';
                            if (mesAPI.fromUserName != mesAPI.toUserName) {
                                usertype = 'remote';
                            }
                            return {
                                displayName: mesAPI.fromUserName,

                                id: mesAPI.id,
                                isReaction: 'false',
                                lobbyChat: 'false',
                                message: mesAPI.message,
                                messageId: mesAPI.id,
                                messageType: usertype,
                                recipient: mesAPI.toUserName,
                                timestamp: new Date(mesAPI.updatedAt).getTime(),
                            };
                        }
                    );

                    this.setState({ allMes: allMes });
                } else {
                    const chattab = document.getElementById('chat-tab');

                    if (chattab != null) {
                        chattab.style.display = 'none';
                    }
                    this.props.dispatch(setIsPollsTabFocused(true));
                }
            });

        if (isMobileBrowser()) {
            // Ensure textarea is not focused when opening chat on mobile browser.
            this._textArea?.current && this._textArea.current.blur();
        }
    }

    _onChatTabKeyDown: (KeyboardEvent) => void;

    /**
     * Key press handler for the chat tab.
     *
     * @param {KeyboardEvent} event - The event.
     * @returns {void}
     */
    _onChatTabKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            this._onToggleChatTab();
        }
    }

    _onEscClick: (KeyboardEvent) => void;

    /**
     * Click handler for the chat sidenav.
     *
     * @param {KeyboardEvent} event - Esc key click to close the popup.
     * @returns {void}
     */
    _onEscClick(event) {
        if (event.key === 'Escape' && this.props._isOpen) {
            event.preventDefault();
            event.stopPropagation();
            this._onToggleChat();
        }
    }

    _onPollsTabKeyDown: (KeyboardEvent) => void;

    /**
     * Key press handler for the polls tab.
     *
     * @param {KeyboardEvent} event - The event.
     * @returns {void}
     */
    _onPollsTabKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            this._onTogglePollsTab();
        }
    }
    _onMessageChange = (value) => {
        this.setState({ messageInput: value });
    };
    _setMessage() {
        let chatMessage = this.state.messageInput;
        this.setState({ messageInput: '' });
        const trimmed = chatMessage;
        const reqBody = {
            meetingId: ApplicationConstants.meetingId,
            fromUserId: ApplicationConstants.userId,
            toUserId: ApplicationConstants.userId,
            message: trimmed,
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody),
        };
        fetch(ApiConstants.chat, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({ chatMessage: '' });

                this.getMessage();
            });
    }
    _onDetectSubmit(event) {
        // Composition events used to add accents to characters
        // despite their absence from standard US keyboards,
        // to build up logograms of many Asian languages
        // from their base components or categories and so on.
        if (event.isComposing || event.keyCode === 229) {
            // keyCode 229 means that user pressed some button,
            // but input method is still processing that.
            // This is a standard behavior for some input methods
            // like entering japanese or сhinese hieroglyphs.
            return;
        }

        if (
            event.key === 'Enter' &&
            event.shiftKey === false &&
            event.ctrlKey === false &&
            this.state.messageInput.trim() != '' &&
            this.state.messageInput.trim() !=
                null &&
            this.state.messageInput.trim() !=
                undefined
        ) 
        
        
        {
            this.setState({ messageInput: '' });
            this._setMessage();
            event.preventDefault();
            event.stopPropagation();
        }
    }
    /**
     * Returns a React Element for showing chat messages and a form to send new
     * chat messages.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderChat() {
        const { _isPollsEnabled, _isPollsTabFocused } = this.props;

        const pollidsdiv = document.getElementById('mainchatcounter');
        if (pollidsdiv != null) {
            pollidsdiv.innerHTML = '';
        }

        if (_isPollsTabFocused) {
            return (
                <>
                    {_isPollsEnabled && this._renderTabs()}
                    <div
                        aria-labelledby={CHAT_TABS.POLLS}
                        id="polls-panel"
                        role="tabpanel"
                    >
                        <PollsPane />

                        {/* <Poll/> */}
                    </div>
                    <KeyboardAvoider />
                </>
            );
        }

        if (this.state.QAtab) {
            return (
                <>
                    {_isPollsEnabled && this._renderTabs()}
                    <div
                        aria-labelledby={CHAT_TABS.QA}
                        className={clsx(
                            'chat-panel1',
                            !_isPollsEnabled && 'chat-panel-no-tabs'
                        )}
                        id="QA-panel"
                        role="tabpanel"
                    >
                        <MessageContainerQA />
                    </div>
                </>
            );
        } else {
            const pollidsdiv = document.getElementById('mainchatcounter');
            if (pollidsdiv != null) {
                pollidsdiv.innerHTML = '';
            }

            return (
                <>
                    {_isPollsEnabled && this._renderTabs()}
                    <div
                        aria-labelledby={CHAT_TABS.CHAT}
                        className={clsx(
                            'chat-panel',
                            !_isPollsEnabled && 'chat-panel-no-tabs'
                        )}
                        id="chat-panel"
                        role="tabpanel"
                    >
                        <MessageContainer messages={this.state.allMes} />
                        <MessageRecipient />
                        <div className="chat-input-container">
                            {/* <ChatInput onSend={this._onSendMessage}/> */}

                            <Input
                                autoFocus={true}
                                className="chat-input"
                                id="chatMessage"
                              
                               
                                maxRows={5}
                                onChange={(e) => {
                                    this._onMessageChange(e);
                                }}
                                onKeyPress={(e) => {
                                    this._onDetectSubmit(e);
                                }}
                                placeholder={this.props.t('chat.messagebox')}
                                ref={this._textArea}
                                textarea={true}
                                value={this.state.messageInput}
                            />

                            <Button
                                icon={IconPlane}
                                onClick={() => {
                                    if (
                                        this.state.messageInput.trim() != '' &&
                                        this.state.messageInput.trim() !=
                                            null &&
                                        this.state.messageInput.trim() !=
                                            undefined
                                    ) {
                                        this._setMessage();
                                    }
                                }}
                                size={isMobileBrowser() ? 'large' : 'medium'}
                            />
                        </div>{' '}
                    </div>
                </>
            );
        }
    }

    /**
     * Returns a React Element showing the Chat and Polls tab.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderTabs() {
        const {
            _isPollsEnabled,
            _isPollsTabFocused,
            _nbUnreadMessages,
            _nbUnreadPolls,
            t,
        } = this.props;

        return (
            <Tabs
                accessibilityLabel={t(
                    _isPollsEnabled ? 'chat.titleWithPolls' : 'chat.title'
                )}
                onChange={this._onChangeTab}
                selected={
                    _isPollsTabFocused
                        ? CHAT_TABS.POLLS
                        : this.state.QAtab
                        ? CHAT_TABS.QA
                        : CHAT_TABS.CHAT
                }
                tabs={[
                    {
                        accessibilityLabel: t('chat.tabs.chat'),
                        countBadge: this.state.chatCounter,
                        id: CHAT_TABS.CHAT,
                        label: t('chat.tabs.chat'),
                    },
                    {
                        accessibilityLabel: t('chat.tabs.polls'),
                        countBadge: this.state.pollCounter,
                        id: CHAT_TABS.POLLS,
                        label: t('chat.tabs.polls'),
                    },
                    {
                        accessibilityLabel: t('chat.tabs.QA'),
                        countBadge: !this.state.QAtab
                            ? this.state.qaCounter
                            : '0',
                        id: CHAT_TABS.QA,
                        label: t('chat.tabs.QA'),
                    },
                ]}
            />
        );
    }

    _onSendMessage: (string) => void;

    _onSendMessageQa: (string) => void;

    _onToggleChat: () => void;

    /**
     * Toggles the chat window.
     *
     * @returns {Function}
     */
    _onToggleChat() {
        this.props.dispatch(toggleChat());
    }
    _onTogglePollsTab: () => void;
    _onToggleChatTab: () => void;
    _onToggleQATab: () => void;
    _onChangeTab: (string) => void;

    /**
     * Change selected tab.
     *
     * @param {string} id - Id of the clicked tab.
     * @returns {void}
     */
    _onChangeTab(id) {
        //id === CHAT_TABS.CHAT ?  this._onToggleChatTab()  :  id === CHAT_TABS.POLLS ?  this._onTogglePollsTab() : this.setState({QAtab:true}); this._onToggleQATab();

        if (id === CHAT_TABS.CHAT) {
            this.setState({
                QAtab: false,
                chatCounter: 0,
                chatOpened: true,
                qaOpened: false,
                pollOpened: false,
            });
            this._onToggleChatTab();
        } else if (id === CHAT_TABS.POLLS) {
            // state["features/base/app"].urlInfo

            this.setState({
                QAtab: false,
                pollCounter: 0,
                chatOpened: false,
                qaOpened: false,
                pollOpened: true,
            });
            this._onTogglePollsTab();
        } else {
            this.setState({
                QAtab: true,
                qaCounter: 0,
                chatOpened: false,
                qaOpened: true,
                pollOpened: false,
            });

            this._onToggleQATab();
        }
    }
}

export default translate(connect(_mapStateToProps)(Chat));
