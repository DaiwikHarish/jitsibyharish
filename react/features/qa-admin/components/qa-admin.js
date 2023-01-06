import React, { useEffect, useState } from 'react';
import Modal, { ModalFooter } from '@atlaskit/modal-dialog';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';

import { IAttendeeInfo } from '../../base/app/types';
import { hideDialog } from '../../base/dialog';
import { ApiConstants } from '../../../../ApiConstants';
import { ApplicationConstants } from '../../../../ApplicationConstants';
import '../qa-admin.css';
import { Icon, IconClose } from '../../base/icons';

const boldStyles = css({
    backgroundColor: 'white',
    display: 'flex',
});

const QuestionAnswer = () => {
    const dispatch = useDispatch();

    function _hideDialog() {
        console.log('alam _hideDialog');
        dispatch(hideDialog(QuestionAnswer));
    }

    return (
        <Modal
            autoFocus={false}
            shouldCloseOnEscapePress={true}
            width={innerWidth}
            height={innerHeight}
            css={boldStyles}
            isChromeless={true}
            scrollBehavior="inside"
        >
            <div className="Container">
                <div className="header">
                    <div className='title'>Questions</div>{' '}
                    <Icon
                        className="btn-close"
                        onClick={_hideDialog}
                        size={24}
                        src={IconClose}
                    />{' '}
                </div>
            </div>
        </Modal>
    );
};

export default QuestionAnswer;
