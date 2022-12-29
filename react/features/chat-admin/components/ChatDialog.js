import React, { useEffect, useState } from 'react';
import Modal, { ModalFooter } from '@atlaskit/modal-dialog';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';

import UserType, { IAttendeeInfo } from '../../base/app/types';
import '../chat-dialog.css';
import { hideDialog } from '../../base/dialog';
import { ApiConstants } from '../../../../ApiConstants';
import { ApplicationConstants } from '../../../../ApplicationConstants';
import { Icon, IconChatSendBtn, IconCloseX } from '../../base/icons';

const boldStyles = css({
    backgroundColor: 'white',
    display: 'flex',
});

const ChatDialog = () => {
    const [attendeeList, setAttendeeList] = useState();
    const [userChat, setUserChat] = useState();
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

    /**
     * Fetching attendee API.
     */
    const FetchChatAPI = async (id) => {
        // this.setState({loading:true});

        fetch(
            ApplicationConstants.API_BASE_URL +
                'chat?meetingId=' +
                ApplicationConstants.meetingId +
                `&userId=${id}`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log('alam chat', data);
                setUserChat(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    const randColor = () => {
        return (
            '#' +
            Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0')
                .toUpperCase()
        );
    };

    console.log(randColor());

    useEffect(() => {
        FetchAttendees();
        // FetchChatAPI()
        randColor();
    }, []);

    console.log('alam attendeeList', userChat);
    console.log('alam ApplicationConstants', ApplicationConstants.userId);

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
                            <div
                                className="Participants-list"
                                key={user.userId}
                                onClick={() => FetchChatAPI(user.userId)}
                            >
                                <h4 className="Name-avatar">
                                    {user.userName
                                        .split(' ')
                                        .reduce(
                                            (acc, subname) => acc + subname[0],
                                            ''
                                        )}
                                </h4>
                                <h4>{user.userName}</h4>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="Right-box">
                    <div className="Right-box-header">
                        <h5 className="Right-box-header-text">
                            viewer@gmail.com | 9896493653
                        </h5>{' '}
                        <button className="btn-danger">Block User</button>{' '}
                        <Icon
                            className="btn-close"
                            onClick={_hideDialog}
                            size={26}
                            src={IconCloseX}
                        />
                    </div>
                    <div className="Right-box-body">
                        {userChat?.map((chat) =>
                            chat.fromUserType === UserType.Admin ? (
                                <h5
                                    key={chat.id}
                                    style={{
                                        backgroundColor: '#242528',
                                        color: 'white',
                                        alignSelf: 'flex-end',
                                    }}
                                >
                                    {chat.fromUserId}
                                    {chat.message}
                                </h5>
                            ) : (
                                <h5
                                    key={chat.id}
                                    style={{
                                        backgroundColor: '#242528',
                                        color: 'white',
                                        alignSelf: 'flex-start',
                                    }}
                                >
                                    {chat.message}
                                </h5>
                            )
                        )}
                    </div>

                    <div className="Right-box-footer">
                        <div className="Send-msg-container">
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
                            <button className="Send-msg-button">
                                <Icon size={26} src={IconChatSendBtn} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChatDialog;
