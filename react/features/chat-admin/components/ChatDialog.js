import React, { useEffect, useState } from 'react';
import Modal, { ModalFooter } from '@atlaskit/modal-dialog';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';

import { IAttendeeInfo } from '../../base/app/types';
import '../chat-dialog.css';
import { hideDialog } from '../../base/dialog';
import { ApiConstants } from '../../../../ApiConstants';
import { ApplicationConstants } from '../../../../ApplicationConstants';

const boldStyles = css({
    backgroundColor: 'white',
    display: 'flex',
});

const ChatDialog = () => {
    const [attendeeList, setAttendeeList] = useState();
    const dispatch = useDispatch();

    function _hideDialog() {
        console.log('alam _hideDialog');
        dispatch(hideDialog(ChatDialog));
    }

    /**
     * Fetching attendee API.
     */
    const FetchAttendees = async () => {
        // this.setState({loading:true});

        fetch(
            ApiConstants.attendee +
                '?meetingId=' +
                ApplicationConstants.meetingId
        )
            .then((response) => response.json())
            .then((data) => {
                const attendee: IAttendeeInfo[] = data;
                console.log('alam attendee', attendee);
                setAttendeeList(attendee);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    useEffect(() => {
        FetchAttendees();
    }, []);

    console.log('alam attendeeList', attendeeList);

    return (
        <Modal
            autoFocus={false}
            shouldCloseOnEscapePress={true}
            width={'x-large'}
            css={boldStyles}
            isChromeless={true}
            scrollBehavior="inside"
        >
            <div className="container">
                <div className="Left-box">
                    <div className="Left-box-header">
                        <h5 className="text">Total Participants: {17}</h5>
                        <button className="button">Refresh</button>
                    </div>
                    <div className="Participants-online">
                        <h5 className="text">Participants online: {13}</h5>
                    </div>
                    <input
                        // aria-label = { accessibilityLabel }
                        // autoFocus = { true }
                        className="Search-input"
                        maxLength={25}
                        // name = {  }
                        // onChange = { handleChange }
                        // onKeyPress = { onKeyPress }
                        placeholder={'Search users'}
                        // value = {  }
                    />
                    <div
                        style={{
                            maxHeight: '75%',
                            overflow: 'auto',
                            marginBottom: '15px',
                        }}
                    >
                        {attendeeList?.map((user) => (
                            <ul className="Participants-list" key={user.userId}>
                                {user.userName}
                            </ul>
                        ))}
                    </div>
                </div>
                <div className="Right-box">
                    <div className="Right-box-header">
                        <h5 className="Right-box-header-text">
                            viewer@gmail.com | 9896493653
                        </h5>{' '}
                        <button className="btn-danger">Block User</button>{' '}
                    </div>
                    <div className="Right-box-body">Body</div>

                    <div className="Right-box-footer">
                        <div className='Send-msg-container'>
                            <input
                                // aria-label = { accessibilityLabel }
                                // autoFocus = { true }
                                className="Send-msg-input"
                                maxLength={25}
                                // name = {  }
                                // onChange = { handleChange }
                                // onKeyPress = { onKeyPress }
                                placeholder={'Send message...'}
                                // value = {  }
                            />
                            <button className="Send-msg-button">Send</button>
                        </div>
                        <button
                            className="btn-danger"
                            role={'button'}
                            onClick={_hideDialog}
                        >
                            Close Chat
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChatDialog;
