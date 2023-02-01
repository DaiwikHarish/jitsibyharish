import React, { useEffect, useState } from "react";
// @ts-ignore
import Modal from "@atlaskit/modal-dialog";

import { useDispatch, useSelector } from "react-redux";
import { css } from "@emotion/react";
import { FadeLoader } from "react-spinners";

import UserType from "../../base/app/types";
import "../chat-dialog.css";

import { ApplicationConstants } from "../../../../ApplicationConstants";
import { IReduxState } from "../../app/types";

import {
    loadAttendees,
    selectedAttendee,
    sendChatMessage,
    updateAttendee,
    updateChatScreenStatus,
} from "../actions";

import { uiTimeFormat, _loadAttendees } from "../functions";
import { IChatDto } from "../../base/cs-socket/types";

//@ts-ignore
import { hideDialog } from "../../base/dialog";

//@ts-ignore
import {
    Icon,
    IconChatSendBtn,
    IconClose,
    IconLock,
    IconRefresh,
    IconUnlock,
} from "../../base/icons";

import { IAttendeeUnSeenCount } from "../types";
import { dumpLog } from "../../app/functions.any";
import { CHAT_ADMIN_SELECTED_ATTENDEE } from "../actionTypes";

const boldStyles = css({
    backgroundColor: "white",
    display: "flex",
    borderRadius: "5px",
});

const ChatDialog = () => {
    const [message, setMessage] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [selected, setSelected] = useState<string>("");

    const list: IAttendeeUnSeenCount[] | undefined = useSelector(
        (state: IReduxState) => state["features/cs-chat-admin"].attendees
    );
    const onlineCount: number | undefined = useSelector(
        (state: IReduxState) => state["features/cs-chat-admin"].onLineCount
    );
    const totalAttendees: number | undefined = useSelector(
        (state: IReduxState) => state["features/cs-chat-admin"].total
    );
    const chatList: IChatDto[] | undefined = useSelector(
        (state: IReduxState) => state["features/cs-chat-admin"].chatHistory
    );

    const loading: boolean | undefined = useSelector(
        (state: IReduxState) => state["features/cs-chat-admin"].isLoading
    );

    const { innerWidth: width, innerHeight: height } = window;

    const dispatch = useDispatch();
    function _hideDialog() {
        dispatch(hideDialog(ChatDialog));
    }

    dumpLog("alam list", list);

    useEffect(() => {
        dispatch(updateChatScreenStatus(true));
        dispatch(loadAttendees());
        console.log("Mount ");
        return () => {
            console.log("Chat admin Unmount ");
            dispatch(updateChatScreenStatus(false));
            dispatch({
                type: CHAT_ADMIN_SELECTED_ATTENDEE,
                selectedAttendeeId: "",
            });
        };
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
                    display: "flex",
                    position: "relative",
                    fontSize: "0px",
                    top: "50%",
                    left: "20px",
                    margin: "auto",
                }}
                color={"white"}
                loading={loading}
            />
            <div className={"ca-container"}>
                <div
                    className={loading ? "ca-loading-left-box" : "ca-left-box"}
                >
                    <div className="ca-participants-online">
                        <div className="ca-active-count">
                            <div
                                style={{
                                    fontSize: "15px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    paddingInline: "5px",
                                }}
                            >
                                Online :{" "}
                            </div>
                            <div
                                style={{
                                    fontSize: "14.5px",
                                    fontWeight: "700",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    paddingRight: "5px",
                                    color: "white",
                                }}
                            >
                                {onlineCount && onlineCount - 1}
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    color: "#858585",
                                }}
                            >
                                ({totalAttendees && totalAttendees - 1})
                            </div>
                        </div>
                        <Icon
                            className="ca-refresh-btn"
                            onClick={() => dispatch(loadAttendees())}
                            size={26}
                            src={IconRefresh}
                        />
                    </div>
                    <div className="ca-search-input-container">
                        <input
                            type="text"
                            className="ca-search-input"
                            maxLength={25}
                            name={"searchInput"}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={"Search users"}
                            value={searchInput}
                        />
                    </div>
                    <div className="ca-participants-list-container">
                        {list &&
                            list
                                ?.slice(0)
                                .reverse()
                                ?.filter((user) => {
                                    if (searchInput === "") {
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
                                                ? "ca-participants-list-selected"
                                                : "ca-participants-list"
                                        }
                                        key={user.userId}
                                        onClick={() => {
                                            dispatch(
                                                selectedAttendee(user.userId)
                                            );
                                            setSelected(user.id);
                                        }}
                                    >
                                        <div className="ca-participant-list-left">
                                            <div className="ca-name-avatar">
                                                <div className="ca-chat-avatar">
                                                    {user.userName
                                                        .split(" ")
                                                        .reduce(
                                                            (acc, subname) =>
                                                                acc +
                                                                subname[0],
                                                            ""
                                                        )}
                                                </div>
                                                <span className="ca-chat-count">
                                                    {user.unSeenCount
                                                        ? user.unSeenCount > 9
                                                            ? "9+"
                                                            : user.unSeenCount
                                                        : ""}
                                                </span>
                                            </div>
                                            <div className="ca-user-name-container">
                                                <div className="ca-user-name">
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
                                        <div className="ca-participant-list-right">
                                            {user.isOnline && (
                                                <div className="ca-online" />
                                            )}
                                            <Icon
                                                className="ca-icon-is-allowed"
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
                <div
                    className={
                        loading ? "ca-loading-right-box" : "ca-right-box"
                    }
                >
                    <div className="ca-right-box-header">
                        <div className="ca-right-box-header-left">
                            {list && selected && (
                                <h5 className="ca-right-box-header-text">
                                    {
                                        list.filter((x) => x.id === selected)[0]
                                            .emailId
                                    }{" "}
                                    |{" "}
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
                                    className={
                                        list.filter((x) => x.id === selected)[0]
                                            ?.isAllowed
                                            ? "ca-btn-danger"
                                            : "ca-btn-safe"
                                    }
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
                            className="ca-btn-close"
                            onClick={_hideDialog}
                            size={26}
                            src={IconClose}
                        />
                    </div>
                    <div className="ca-right-box-body">
                        {selected &&
                            chatList &&
                            chatList?.map((chat) =>
                                chat.fromUserId ===
                                ApplicationConstants.userId ? (
                                    <div
                                        key={chat.id}
                                        style={{
                                            flexWrap: "wrap",
                                            alignSelf: "flex-end",
                                            maxWidth: "90%",
                                            paddingBlock: "5px",
                                        }}
                                    >
                                        <div
                                            key={chat.id}
                                            className="ca-right-message"
                                        >
                                            <div className="ca-message">
                                                {chat.message}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-end",
                                                justifyContent: "flex-end",
                                                color: "#aaa",
                                                fontSize: "12px",
                                                fontFamily:
                                                    "Arial, Helvetica, sans-serif",
                                            }}
                                        >
                                            {uiTimeFormat(chat.createdAt)}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={chat.id}
                                        style={{
                                            alignSelf: "flex-start",
                                            flexWrap: "wrap",
                                            maxWidth: "95%",
                                            paddingBlock: "5px",
                                        }}
                                    >
                                        <div
                                            key={chat.id}
                                            className="ca-left-message"
                                        >
                                            <div className="ca-chat-username">
                                                {chat.fromUserName}
                                            </div>
                                            <div
                                                style={{
                                                    marginLeft: "7px",
                                                    wordWrap: "break-word",
                                                    textOverflow: "ellipsis",
                                                }}
                                                className="ca-message"
                                            >
                                                {chat.message}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                color: "#aaa",
                                                fontSize: "12px",
                                                fontFamily:
                                                    "Arial, Helvetica, sans-serif",
                                            }}
                                        >
                                            {uiTimeFormat(chat.createdAt)}
                                        </div>
                                    </div>
                                )
                            )}
                    </div>

                    <div className="ca-right-box-footer">
                        <div className="ca-send-msg-container">
                            <input
                                autoFocus={true}
                                className="ca-send-msg-input"
                                name={"message"}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={"Send message..."}
                                value={message}
                            />
                            <button
                                disabled={
                                    message === undefined || message === ""
                                }
                                onClick={() => {
                                    dispatch(sendChatMessage(message));
                                    setMessage("");
                                }}
                                className="ca-send-msg-button"
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
