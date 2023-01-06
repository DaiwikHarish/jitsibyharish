import React, { Component } from 'react';

import Dialog from '../base/ui/components/web/Dialog';

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
            <Dialog
                cancel = {{ hidden: true }}
                ok = {{ hidden: true }}
                className="pollDialog"
                size='large'
                titleKey = 'Poll'>
                <Poll />
            </Dialog>
        );
    }
}
