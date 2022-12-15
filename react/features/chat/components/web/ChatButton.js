// @flow

import React from 'react';

import { translate } from '../../../base/i18n';
import { IconChat } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox/components';

import ChatCounter from './ChatCounter';

/**
 * The type of the React {@code Component} props of {@link ChatButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * Whether or not the chat feature is currently displayed.
     */
     _chatOpen: boolean,
     _socketChatMessage:Number
};

/**
 * Implementation of a button for accessing chat pane.
 */
class ChatButton extends AbstractButton<Props, *> {

    constructor(props: Props) {
        super(props);
        this.state = {
       chatCounter:0,}
        }

     
    accessibilityLabel = 'toolbar.accessibilityLabel.chat';
    icon = IconChat;
    label = 'toolbar.openChat';
    toggledLabel = 'toolbar.closeChat';

    /**
     * Retrieves tooltip dynamically.
     */
    get tooltip() {
        if (this._isToggled()) {
            return 'toolbar.closeChat';
        }

        return 'toolbar.openChat';
    }

    /**
     * Required by linter due to AbstractButton overwritten prop being writable.
     *
     * @param {string} _value - The value.
     */
    set tooltip(_value) {
        // Unused.
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        
        return this.props._chatOpen;
    }

    /**
     * Overrides AbstractButton's {@link Component#render()}.
     *
     * @override
     * @protected
     * @returns {boReact$Nodeolean}
     */
    render(): React$Node {

  




        return (
            <div
                className = 'toolbar-button-with-badge'
                key = 'chatcontainer'>
                {super.render()}
                <span className = 'badge-round'>

<span id="mainchatcounter">
  {this.state.chatCounter!=0 ?this.state.chatCounter:""}
</span>
</span>
                {/* <ChatCounter /> */}
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) 
    {  

    


        if( this.props._socketChatMessage!="" && this.props._socketChatMessage!=null && this.props._socketChatMessage!=undefined)
        { 

            let hasNewMessagesChat = this.props._socketChatMessage !== prevProps._socketChatMessage;

            if (hasNewMessagesChat) {
 
if(!this.props._chatOpen)
{
    let counter=this.state.chatCounter;
   counter++
  this.setState({chatCounter:counter})


 
}
         }
         
        }

        if( this.props._socketQaMessage!="" && this.props._socketQaMessage!=null && this.props._socketQaMessage!=undefined)
        { 

            let hasNewMessagesChat = this.props._socketQaMessage !== prevProps._socketQaMessage;

            if (hasNewMessagesChat) {
 
if(!this.props._chatOpen)
{
    let counter=this.state.chatCounter;
   counter++
  this.setState({chatCounter:counter})


 
}
         }
         
        }

        if( this.props._socketPollStartMessage!="" && this.props._socketPollStartMessage!=null && this.props._socketPollStartMessage!=undefined)
        { 

            let hasNewMessagesChat = this.props._socketPollStartMessage !== prevProps._socketPollStartMessage;

            if (hasNewMessagesChat) {
 
if(!this.props._chatOpen)
{
    let counter=this.state.chatCounter;
   counter++
  this.setState({chatCounter:counter})


 
}
         }
         
        }

        if( this.props._socketPollEndMessage!="" && this.props._socketPollEndMessage!=null && this.props._socketPollEndMessage!=undefined)
        { 

            let hasNewMessagesChat = this.props._socketPollEndMessage !== prevProps._socketPollEndMessage;

            if (hasNewMessagesChat) {
 
if(!this.props._chatOpen)
{
    let counter=this.state.chatCounter;
   counter++
  this.setState({chatCounter:counter})


 
}
         }
         
        }

    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const mapStateToProps = state => {
    const { socketChatMessage,socketQaMessage,socketPollStartMessage,socketPollEndMessage } = state["features/base/cs-socket"];
  
    return {
        _chatOpen: state['features/chat'].isOpen,
        _socketChatMessage:socketChatMessage,
        _socketQaMessage:socketQaMessage,
        _socketPollStartMessage:socketPollStartMessage,
        _socketPollEndMessage:socketPollEndMessage
    };
};

export default translate(connect(mapStateToProps)(ChatButton));
