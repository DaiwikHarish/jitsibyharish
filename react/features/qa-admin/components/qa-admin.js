import React, { useEffect, useState } from 'react';
import Modal, { ModalFooter } from '@atlaskit/modal-dialog';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';

import { IAttendeeInfo } from '../../base/app/types';
import { hideDialog } from '../../base/dialog';
import { ApiConstants } from '../../../../ApiConstants';
import { ApplicationConstants } from '../../../../ApplicationConstants';

const boldStyles = css({
    backgroundColor: 'white',
    display: 'flex',
});

const QuestionAnswer = () => {


    const { innerWidth: width, innerHeight: height } = window;
    const dispatch = useDispatch();

    function _hideDialog() {
        console.log('alam _hideDialog');
        dispatch(hideDialog(ChatDialog));
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
            
                   <div className='header'>welcome</div>
        </Modal>
    );
};

export default QuestionAnswer;