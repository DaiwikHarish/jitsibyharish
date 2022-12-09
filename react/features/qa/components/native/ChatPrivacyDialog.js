// @flow

import React from 'react';

import { ConfirmDialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { AbstractChatPrivacyDialog, _mapDispatchToProps, _mapStateToProps } from '../AbstractChatPrivacyDialog';

/**
 * Implements a component for the dialog displayed to avoid mis-sending private messagesQa.
 */
class ChatPrivacyDialog extends AbstractChatPrivacyDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <ConfirmDialog
                cancelLabel = 'dialog.sendPrivateMessageCancel'
                confirmLabel = 'dialog.sendPrivateMessageOk'
                descriptionKey = 'dialog.sendPrivateMessage'
                onCancel = { this._onSendGroupMessage }
                onSubmit = { this._onSendPrivateMessage } />
        );
    }

    _onSendGroupMessage: () => boolean;

    _onSendPrivateMessage: () => boolean;
}

export default translate(connect(_mapStateToProps, _mapDispatchToProps)(ChatPrivacyDialog));
