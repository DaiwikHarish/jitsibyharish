import React, { useEffect, useState, useRef } from 'react';
// @ts-ignore
import Modal from '@atlaskit/modal-dialog';

import { connect, useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
import { FadeLoader } from 'react-spinners';

import UserType, { IAttendeeInfo } from '../../base/app/types';
import '../chat-dialog.css';

import { ApplicationConstants } from '../../../../ApplicationConstants';
import { IReduxState } from '../../app/types';

import {
    loadAttendees,
    selectedAttendee,
    sendChatMessage,
    updateAttendee,
} from '../actions';

import { uiTimeFormat, _loadAttendees } from '../functions';
import { IChatDto } from '../../base/cs-socket/types';

//@ts-ignore
import { hideDialog } from '../../base/dialog';

//@ts-ignore
import { Icon, IconChatSendBtn, IconClose, IconLock, IconRefresh, IconUnlock } from '../../base/icons';

const boldStyles = css({
    backgroundColor: 'white',
    display: 'flex',
    borderRadius: '5px',
});

// type Props = {
//     _attendeeList: IAttendeeInfo | undefined;
// };



const ChatDialog = () => {
    const [message, setMessage] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selected, setSelected] = useState<string>('');

    const list: IAttendeeInfo[] | undefined = useSelector(
        (state: IReduxState) => state['features/cs-chat-admin'].attendees
    );
    const onlineCount: number | undefined = useSelector(
        (state: IReduxState) => state['features/cs-chat-admin'].onLineCount
    );
    const totalAttendees: number | undefined = useSelector(
        (state: IReduxState) => state['features/cs-chat-admin'].total
    );
    const chatLst: IChatDto[] | undefined = useSelector(
        (state: IReduxState) => state['features/cs-chat-admin'].chatHistory
    );

    const loading: boolean | undefined = useSelector(
        (state: IReduxState) => state['features/cs-chat-admin'].isLoading
    );
    console.log('alam list', list);

    const { innerWidth: width, innerHeight: height } = window;

    const dispatch = useDispatch();
    // const messagesEndRef = (useRef < null) | (HTMLDivElement > null);
    function _hideDialog() {
        console.log('alam _hideDialog');
        dispatch(hideDialog(ChatDialog));
    }

    useEffect(() => {
        dispatch(loadAttendees());
    }, []);

    return (
        <Modal
            autoFocus={false}
            shouldCloseOnEscapePress={true}
            width={innerWidth}
            css={boldStyles}
            isChromeless={true}
            scrollBehavior="inside"
        >
            <FadeLoader
                cssOverride={{
                    display: 'flex',
                    position: 'relative',
                    fontSize: '0px',
                    top: '50%',
                    left: '20px',
                    margin: 'auto',
                }}
                color={'white'}
                loading={loading}
            />
            <div className={'container'}>
                <div className={loading ? 'loading-left-box' : 'Left-box'}>
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
                                {onlineCount && onlineCount - 1}
                            </div>
                            <div
                                style={{
                                    fontSize: '14px',
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                    color: '#858585',
                                }}
                            >
                                ({totalAttendees && totalAttendees - 1})
                            </div>
                        </div>
                        <Icon
                            className="Refresh-btn"
                            onClick={() => dispatch(loadAttendees())}
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
                        {list &&
                            list
                                ?.filter((user) => {
                                    if (searchInput === '') {
                                        return user;
                                    } else if (
                                        user?.userName
                                            .toLowerCase()
                                            .includes(searchInput.toLowerCase())
                                    ) {
                                        return user;
                                    }
                                })
                                .filter(
                                    (user) =>
                                        user.userId !==
                                        ApplicationConstants.userId
                                )
                                .map((user) => (
                                    <div
                                        className={
                                            selected === user.id
                                                ? 'Participants-list-selected'
                                                : 'Participants-list'
                                        }
                                        key={user.userId}
                                        onClick={() => {
                                            dispatch(
                                                selectedAttendee(user.userId)
                                            );
                                            setSelected(user.id);
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
                <div className={loading ? 'loading-right-box' : 'Right-box'}>
                    <div className="Right-box-header">
                        <div className="Right-box-header-left">
                            {list && selected && (
                                <h5 className="Right-box-header-text">
                                    {
                                        list.filter((x) => x.id === selected)[0]
                                            .emailId
                                    }{' '}
                                    |{' '}
                                    {
                                        list.filter((x) => x.id === selected)[0]
                                            .mobileNr
                                    }
                                </h5>
                            )}
                            {list && selected && (
                                <button
                                    onClick={() => {
                                        if (
                                            list.filter(
                                                (x) => x.id === selected
                                            )[0]?.isAllowed === false
                                        ) {
                                            dispatch(updateAttendee(true));
                                        } else {
                                            dispatch(updateAttendee(false));
                                        }
                                    }}
                                    className="btn-danger"
                                >
                                    {list.filter((x) => x.id === selected)[0]
                                        ?.isAllowed ? (
                                        <p>Block User</p>
                                    ) : (
                                        <p>Unblock User</p>
                                    )}
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
                        {chatLst &&
                            chatLst?.map((chat) =>
                                chat.fromUserId ===
                                ApplicationConstants.userId ? (
                                    <div
                                        key={chat.id}
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
                                            {uiTimeFormat(chat.createdAt)}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={chat.id}
                                        style={{
                                            alignSelf: 'flex-start',
                                            flexWrap: 'wrap',
                                            maxWidth: '95%',
                                            paddingBlock: '5px',
                                        }}
                                    >
                                        <div
                                            key={chat.id}
                                            className="Left-message"
                                        >
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
                                            { uiTimeFormat(chat.createdAt)}
                                            
                                        </div>
                                    </div>
                                )
                            )}
                        {/* <div ref={messagesEndRef} /> */}
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
                                disabled={
                                    message === undefined || message === ''
                                }
                                onClick={() => {
                                    dispatch(sendChatMessage(message));
                                    setMessage('');
                                    // scrollToBottom();
                                }}
                                className="Send-msg-button"
                            >
                                <Icon size={26} src={IconChatSendBtn} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* )} */}
        </Modal>
    );
};

export default ChatDialog;
// export default ChatDialog;
