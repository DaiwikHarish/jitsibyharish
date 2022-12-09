// @flow

import React, { Component } from 'react';

import ChatMessage from './ChatMessage';

type Props = {

    /**
     * Additional CSS classes to apply to the root element.
     */
    className: string,

    /**
     * The messagesQa to display as a group.
     */
    messagesQa: Array<Object>,
};

/**
 * Displays a list of chat messagesQa. Will show only the display name for the
 * first chat message and the timestamp for the last chat message.
 *
 * @augments React.Component
 */
class ChatMessageGroup extends Component<Props> {
    static defaultProps = {
        className: ''
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { className, messagesQa } = this.props;

        const messagesLength = messagesQa.length;

        if (!messagesLength) {
            return null;
        }

        return (
            <div className = { `qa-message-group ${className}` }>
                { messagesQa.map((message, i) => (
                    <ChatMessage
                        key = { i }
                        message = { message }
                        showDisplayName = { i === 0 }
                        showTimestamp = { i === messagesQa.length - 1 } />
                ))}
            </div>
        );
    }
}

export default ChatMessageGroup;
