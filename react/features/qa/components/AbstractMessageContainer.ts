import { Component } from 'react';

import { IMessage } from '../reducer';

export interface IProps {

    /**
     * The messagesQa array to render.
     */
    messagesQa: IMessage[];
}

/**
 * Abstract component to display a list of chat messagesQa, grouped by sender.
 *
 * @augments PureComponent
 */
export default class AbstractMessageContainer<P extends IProps, S> extends Component<P, S> {
    static defaultProps = {
        messagesQa: [] as IMessage[]
    };

    /**
     * Iterates over all the messagesQa and creates nested arrays which hold
     * consecutive messagesQa sent by the same participant.
     *
     * @private
     * @returns {Array<Array<Object>>}
     */
    _getMessagesGroupedBySender() {
        const messagesCount = this.props.messagesQa.length;
        const groups: IMessage[][] = [];
        let currentGrouping: IMessage[] = [];
        let currentGroupParticipantId;

        for (let i = 0; i < messagesCount; i++) {
            const message = this.props.messagesQa[i];

            if (message.id === currentGroupParticipantId) {
                currentGrouping.push(message);
            } else {
                currentGrouping.length && groups.push(currentGrouping);

                currentGrouping = [ message ];
                currentGroupParticipantId = message.id;
            }
        }

        currentGrouping.length && groups.push(currentGrouping);

        return groups;
    }
}
