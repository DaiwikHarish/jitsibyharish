import React, { Component } from 'react';

import Dialogpoll from '../base/ui/components/web/Dialogpoll';
// @ts-ignore
import Poll from './poll';

/**
 * Implements a React {@link Component} which displays the component
 * {@code Poll} in a dialog.
 *
 * @augments Component
 */
export default class PollDialog extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Dialogpoll
                cancel = {{ hidden: true }}
                ok = {{ hidden: true }}
                disableBackdropClose={true}
                disableEnter={true}
                className="pollDialog"
                size='extralarge'
                
                titleKey = 'Admin Poll'>
                <Poll showAddmessage={false}/>
            </Dialogpoll>
        );
    }
}
