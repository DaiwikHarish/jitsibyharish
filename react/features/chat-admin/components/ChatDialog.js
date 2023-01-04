import React, { useEffect, useState } from 'react';
import Modal from '@atlaskit/modal-dialog';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';

import UserType, { IAttendeeInfo } from '../../base/app/types';
import '../chat-dialog.css';
import { hideDialog } from '../../base/dialog';
import { ApiConstants } from '../../../../ApiConstants';
import { ApplicationConstants } from '../../../../ApplicationConstants';
import {
    Icon,
    IconChatSendBtn,
    IconClose,
    IconLock,
    IconRefresh,
    IconUnlock,
} from '../../base/icons';
import { getLocalizedDateFormatter } from '../../base/i18n';
import { fontSize } from '@atlaskit/theme';

const boldStyles = css({
    backgroundColor: 'white',
    display: 'flex',
    borderRadius: '5px',
});

const TIMESTAMP_FORMAT = 'H:mm';

const ChatDialog = () => {
    const [attendeeList, setAttendeeList] = useState();
    const [userChat, setUserChat] = useState();
    const [user, setUser] = useState();
    const [message, setMessage] = useState();

    const [searchInput, setSearchInput] = useState('');
    const [block, setBlock] = useState(user?.isAllowed);
    const [selected, setSelected] = useState();

    const { innerWidth: width, innerHeight: height } = window;

    const dispatch = useDispatch();

    function _hideDialog() {
        // console.log('alam _hideDialog');
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
                // console.log('alam attendee', attendee);
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
                // console.log('alam chat', data);
                setUserChat(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const onSendMessage = async (msg) => {
        // console.log('alam msg', msg);

        fetch(ApiConstants.chat, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',

            // Fields that to be updated are passed
            body: JSON.stringify({
                meetingId: ApplicationConstants.meetingId,
                fromUserId: ApplicationConstants.userId,
                toUserId: user.userId,
                message: msg,
            }),
        })
            .then((response) => {
                response.json();
                // setMessage(undefined);
            })
            .then((data) => {
                // console.log('alam chat', data);
                FetchChatAPI(user.userId);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    function _onBlockUser(value: Boolean) {
        console.log('alam before', user?.id + '|' + user?.isAllowed);

        fetch(ApiConstants.attendee, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'PATCH',

            // Fields that to be updated are passed
            body: JSON.stringify({
                isAllowed: value,
                id: user?.id,
            }),
        })
            .then((response) => {
                console.log('Updated Successfully');
            })
            .then((data) => {
                FetchAttendees();
                FetchChatAPI(user?.userId);
            })
            .catch((err) => {});
    }

    useEffect(() => {
        FetchAttendees();
        console.log('alam window-Width', innerWidth);
        console.log('alam window-Height', innerHeight);
    }, [block]);

    // console.log('alam attendeeList', userChat);
    console.log('alam initial', user?.isAllowed);

    return (
        <Modal
            autoFocus={false}
            shouldCloseOnEscapePress={true}
            width={innerWidth}
            css={boldStyles}
            isChromeless={true}
            scrollBehavior="inside"
        >
            <div className="container">
                <div className="Left-box">
                    {/* <div className="Left-box-header">
                        <h5 className="text">Total: {attendeeList?.length}</h5>
                        <button
                            onClick={() => FetchAttendees()}
                            className="button"
                        >
                            Refresh
                        </button>
                    </div> */}
                    <div className="Participants-online">
                        <div className="Active-count">
                            <div
                                style={{
                                    fontSize: '15px',
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                    paddingInline: '5px',
                                }}
                            >
                                Online :{' '}
                            </div>
                            <div
                                style={{
                                    fontSize: '14.5px',
                                    fontWeight: '700',
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                    paddingRight: '5px',
                                    color: 'white',
                                }}
                            >
                                {
                                    attendeeList?.filter(
                                        (a) => a.isOnline === true
                                    ).length-1
                                }
                            </div>
                            <div
                                style={{
                                    fontSize: '14px',
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                    color: '#858585',
                                }}
                            >
                                ({attendeeList?.length - 1})
                            </div>
                        </div>
                        <Icon
                            className="Refresh-btn"
                            onClick={() => FetchAttendees()}
                            size={26}
                            src={IconRefresh}
                        />
                    </div>
                    <div className="Search-input-container">
                        <input
                            type="text"
                            // aria-label = { accessibilityLabel }
                            // autoFocus = { true }
                            className="Search-input"
                            maxLength={25}
                            name={'searchInput'}
                            onChange={(e) => setSearchInput(e.target.value)}
                            // onKeyPress = { onKeyPress }
                            placeholder={'Search users'}
                            value={searchInput}
                        />
                    </div>
                    <div className="Participants-list-container">
                        {attendeeList
                            ?.filter((user) => {
                                if (searchInput === '') {
                                    return user;
                                } else if (
                                    user.userName
                                        .toLowerCase()
                                        .includes(searchInput.toLowerCase())
                                ) {
                                    return user;
                                }
                            })
                            .filter(
                                (user) =>
                                    user.userId !== ApplicationConstants.userId
                            )
                            .map((user, index) => (
                                <div
                                    className={
                                        selected === index
                                            ? 'Participants-list-selected'
                                            : 'Participants-list'
                                    }
                                    key={index}
                                    onClick={() => {
                                        FetchChatAPI(user.userId);
                                        setUser(user);
                                        setSelected(index);
                                    }}
                                >
                                    <div className="Participant-list-left">
                                        <div className="Name-avatar">
                                            {user.userName
                                                .split(' ')
                                                .reduce(
                                                    (acc, subname) =>
                                                        acc + subname[0],
                                                    ''
                                                )}
                                        </div>
                                        <div className="User-name-container">
                                            <div className="User-name">
                                                {user.userName}
                                            </div>
                                            {user.userType ===
                                                UserType.Admin && (
                                                <div>Moderator</div>
                                            )}
                                            {user.userType ===
                                                UserType.Presenter && (
                                                <div>Host</div>
                                            )}
                                            {user.userType ===
                                                UserType.Viewer && (
                                                <div>Participant</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="Participant-list-right">
                                        {user.isOnline && (
                                            <div className="Online" />
                                        )}
                                        <Icon
                                            className="icon-isAllowed"
                                            size={16}
                                            src={
                                                user.isAllowed
                                                    ? IconUnlock
                                                    : IconLock
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="Right-box">
                    <div className="Right-box-header">
                        <div className="Right-box-header-left">
                            {user && (
                                <h5 className="Right-box-header-text">
                                    {user?.emailId} | {user?.mobileNr}
                                </h5>
                            )}
                            {user && (
                                <button
                                    onClick={() => {
                                        console.log(
                                            'alam isAllowed',
                                            user.isAllowed
                                        );
                                        if (user?.isAllowed === false) {
                                            _onBlockUser(true);
                                            setBlock(false);
                                        } else {
                                            _onBlockUser(false);
                                            setBlock(true);
                                        }
                                    }}
                                    className="btn-danger"
                                >
                                    {block === false
                                        ? 'Block User'
                                        : 'Unblock User'}
                                </button>
                            )}
                        </div>
                        <Icon
                            className="btn-close"
                            onClick={_hideDialog}
                            size={26}
                            src={IconClose}
                        />
                    </div>
                    <div className="Right-box-body">
                        {userChat?.map((chat) =>
                            chat.fromUserId === ApplicationConstants.userId ? (
                                <div
                                    style={{
                                        flexWrap: 'wrap',
                                        alignSelf: 'flex-end',
                                        maxWidth: '90%',
                                        paddingBlock: '5px',
                                    }}
                                >
                                    <div
                                        key={chat.id}
                                        className="Right-message"
                                    >
                                        <div className="message">
                                            {chat.message}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            color: '#aaa',
                                            fontSize: '12px',
                                            fontFamily:
                                                'Arial, Helvetica, sans-serif',
                                        }}
                                    >
                                        {getLocalizedDateFormatter(
                                            new Date(chat.createdAt)
                                        ).format(TIMESTAMP_FORMAT)}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        alignSelf: 'flex-start',
                                        flexWrap: 'wrap',
                                        maxWidth: '95%',
                                        paddingBlock: '5px',
                                    }}
                                >
                                    <div key={chat.id} className="Left-message">
                                        <div className="chat-username">
                                            {chat.fromUserName}
                                        </div>
                                        <div
                                            style={{
                                                marginLeft: '7px',
                                                // overflow: 'hidden',
                                                wordWrap: 'break-word',
                                                textOverflow: 'ellipsis',
                                            }}
                                            className="message"
                                        >
                                            {chat.message}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            color: '#aaa',
                                            fontSize: '12px',
                                            fontFamily:
                                                'Arial, Helvetica, sans-serif',
                                        }}
                                    >
                                        {getLocalizedDateFormatter(
                                            new Date(chat.createdAt)
                                        ).format(TIMESTAMP_FORMAT)}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div className="Right-box-footer">
                        <div className="Send-msg-container">
                            <input
                                // aria-label = { accessibilityLabel }
                                autoFocus={true}
                                className="Send-msg-input"
                                // maxLength={25}
                                name={'message'}
                                onChange={(e) => setMessage(e.target.value)}
                                // onKeyPress = { onKeyPress }
                                placeholder={'Send message...'}
                                value={message}
                            />
                            <button
                                disabled={message === undefined}
                                onClick={() => {
                                    onSendMessage(message);
                                    setMessage('');
                                }}
                                className="Send-msg-button"
                            >
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
