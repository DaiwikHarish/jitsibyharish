import React, { Component, RefObject } from 'react';
import { WithTranslation } from 'react-i18next';

import { IReduxState, IStore } from '../../../app/types';
import { isMobileBrowser } from '../../../base/environment/utils';
import { translate } from '../../../base/i18n/functions';
import { IconHelp, IconPlane, IconSmile } from '../../../base/icons/svg';
import { connect } from '../../../base/redux/functions';
import Button from '../../../base/ui/components/web/Button';
import Input from '../../../base/ui/components/web/Input';
import { areSmileysDisabled } from '../../functions';
import {IUrlInfo} from '../../../base/app/types'
// @ts-ignore
import SmileysPanel from './SmileysPanel';

/**
 * The type of the React {@code Component} props of {@link ChatInput}.
 */
interface IProps extends WithTranslation {

    /**
     * Whether QA emoticons are disabled.
     */
    _areSmileysDisabled: boolean;

    /**
     * Invoked to send QA messagesQasQa.
     */
    dispatch: IStore['dispatch'];

    /**
     * Callback to invoke on messagesQa send.
     */
    onSend: Function;

    _urlInfo:IUrlInfo;

}

/**
 * The type of the React {@code Component} state of {@link ChatInput}.
 */
interface IState {

    /**
     * User provided nickname when the input text is provided in the view.
     */
    messagesQa: string;

    /**
     * Whether or not the smiley selector is visible.
     */
    showSmileysPanel: boolean;
}

/**
 * Implements a React Component for drafting and submitting a QA messagesQa.
 *
 * @augments Component
 */
class ChatInput extends Component<IProps, IState> {
    _textArea?: RefObject<HTMLTextAreaElement>;

    state = {
        messagesQa: '',
        showSmileysPanel: false
    };

    /**
     * Initializes a new {@code ChatInput} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps) {
        super(props);

        this._textArea = React.createRef<HTMLTextAreaElement>();

        // Bind event handlers so they are only bound once for every instance.
        this._onDetectSubmit = this._onDetectSubmit.bind(this);
        this._onmessagesQaChange = this._onmessagesQaChange.bind(this);
        this._onSmileySelect = this._onSmileySelect.bind(this);
        this._onSubmitmessagesQa = this._onSubmitmessagesQa.bind(this);
        this._toggleSmileysPanel = this._toggleSmileysPanel.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        if (isMobileBrowser()) {
            // Ensure textarea is not focused when opening QA on mobile browser.
            this._textArea?.current && this._textArea.current.blur();
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <div className = { `chat-input-container${this.state.messagesQa.trim().length ? ' populated' : ''}` }>
                <div id = 'chat-input' >
                    {!this.props._areSmileysDisabled && this.state.showSmileysPanel && (
                        <div
                            className = 'smiley-input'>
                            <div
                                className = 'smileys-panel' >
                                <SmileysPanel
                                    onSmileySelect = { this._onSmileySelect } />
                            </div>
                        </div>
                    )}
                    <Input
                        autoFocus = { true }
                        className = 'QA-input'
                        icon = { this.props._areSmileysDisabled ? undefined : IconHelp }
                        iconClick = { this._toggleSmileysPanel }
                        maxRows = { 5 }
                        onChange = { this._onmessagesQaChange }
                        onKeyPress = { this._onDetectSubmit }
                        placeholder ="Your Question here"
                        ref = { this._textArea }
                        textarea = { true }
                        value = { this.state.messagesQa } />
                    <Button
                        accessibilityLabel = { this.props.t('QA.sendButton') }
                        disabled = { !this.state.messagesQa.trim() }
                        icon = { IconPlane }
                        onClick = { this._onSubmitmessagesQa }
                        size = { isMobileBrowser() ? 'large' : 'medium' } />
                </div>
            </div>
        );
    }

    /**
     * Place cursor focus on this component's text area.
     *
     * @private
     * @returns {void}
     */
    _focus() {
        this._textArea?.current && this._textArea.current.focus();
    }

    /**
     * Submits the messagesQa to the QA window.
     *
     * @returns {void}
     */
    _onSubmitmessagesQa() {
        
        const trimmed = this.state.messagesQa.trim();

        if (trimmed) {
            
          //  this.props.onSend(trimmed);

//post messagesQa by API (Harish)
 


const meetingId = this.props._urlInfo.meetingId;
const userId = this.props._urlInfo.userId;
let url = 'https://dev.awesomereviewstream.com/svr/api/question?meetingId='+meetingId+'&userId='+userId;
fetch(url,{
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",     
  
    // Fields that to be updated are passed
    body: JSON.stringify({
        "meetingId": meetingId,
        "fromUserId": userId,
       "question": trimmed,
     
    })
})


            this.setState({ messagesQa: '' });

            // Keep the textarea in focus when sending messagesQasQa via submit button.
            this._focus();
        }

    }

    /**
     * Detects if enter has been pressed. If so, submit the messagesQa in the QA
     * window.
     *
     * @param {string} event - Keyboard event.
     * @private
     * @returns {void}
     */
    _onDetectSubmit(event: any) {
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

        if (event.key === 'Enter'
            && event.shiftKey === false
            && event.ctrlKey === false) {
            event.preventDefault();
            event.stopPropagation();

            this._onSubmitmessagesQa();
        }
    }

    /**
     * Updates the known messagesQa the user is drafting.
     *
     * @param {string} value - Keyboard event.
     * @private
     * @returns {void}
     */
    _onmessagesQaChange(value: string) {
        this.setState({ messagesQa: value });
    }

    /**
     * Appends a selected smileys to the QA messagesQa draft.
     *
     * @param {string} smileyText - The value of the smiley to append to the
     * QA messagesQa.
     * @private
     * @returns {void}
     */
    _onSmileySelect(smileyText: string) {
        if (smileyText) {
            this.setState({
                messagesQa: `${this.state.messagesQa} ${smileyText}`,
                showSmileysPanel: false
            });
        } else {
            this.setState({
                showSmileysPanel: false
            });
        }

        this._focus();
    }

    /**
     * Callback invoked to hide or show the smileys selector.
     *
     * @private
     * @returns {void}
     */
    _toggleSmileysPanel() {
        if (this.state.showSmileysPanel) {
            this._focus();
        }
        this.setState({ showSmileysPanel: !this.state.showSmileysPanel });
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @private
 * @returns {{
 *     _areSmileysDisabled: boolean
 * }}
 */
const mapStateToProps = (state: IReduxState) => {
    return {
        _areSmileysDisabled: areSmileysDisabled(state),
        _urlInfo: state["features/base/app"].urlInfo,
    };
};

export default translate(connect(mapStateToProps)(ChatInput));
