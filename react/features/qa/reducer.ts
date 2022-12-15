import { v4 as uuidv4 } from 'uuid';

import { ILocalParticipant, IParticipant } from '../base/participants/types';
import ReducerRegistry from '../base/redux/ReducerRegistry';

import {
    ADD_MESSAGE,
    CLEAR_MESSAGES,
    CLOSE_CHAT,
    EDIT_MESSAGE,
    OPEN_CHAT,
    REMOVE_LOBBY_CHAT_PARTICIPANT,
    SET_IS_POLL_TAB_FOCUSED,
    SET_LOBBY_CHAT_ACTIVE_STATE,
    SET_LOBBY_CHAT_RECIPIENT,
    SET_PRIVATE_MESSAGE_RECIPIENT
} from './actionTypes';

const DEFAULT_STATE = {
    isOpen: false,
    isPollsTabFocused: false,
    lastReadMessage: undefined,
    messagesQa: [],
    nbUnreadMessages: 0,
    privateMessageRecipient: undefined,
    lobbyMessageRecipient: undefined,
    isLobbyChatActive: false
};

export interface IMessage {
    displayName: string;
    error?: Object;
    id: string;
    isReaction: boolean;
    lobbyChat: boolean;
    message: string;
    messageId: string;
    messageType: string;
    privateMessage: boolean;
    recipient: string;
    timestamp: number;
}

export interface IChatStateQA {
    isLobbyChatActive: boolean;
    isOpen: boolean;
    isPollsTabFocused: boolean;
    lastReadMessage?: IMessage;
    lobbyMessageRecipient?: {
        id: string;
        name: string;
    } | ILocalParticipant;
    messagesQa: IMessage[];
    nbUnreadMessages: number;
    privateMessageRecipient?: IParticipant;
}

ReducerRegistry.register<IChatStateQA>('features/qa', (state = DEFAULT_STATE, action): IChatStateQA => {
    switch (action.type) {
    case ADD_MESSAGE: {
        const newMessage: IMessage = {
            displayName: action.displayName,
            error: action.error,
            id: action.id,
            isReaction: action.isReaction,
            messageId: uuidv4(),
            messageType: action.messageType,
            message: action.message,
            privateMessage: action.privateMessage,
            lobbyChat: action.lobbyChat,
            recipient: action.recipient,
            timestamp: action.timestamp
        };

        // React native, unlike web, needs a reverse sorted message list.
        const messagesQa = navigator.product === 'ReactNative'
            ? [
                newMessage,
                ...state.messagesQa
            ]
            : [
                ...state.messagesQa,
                newMessage
            ];

        return {
            ...state,
            lastReadMessage:
                action.hasRead ? newMessage : state.lastReadMessage,
            nbUnreadMessages: state.isPollsTabFocused ? state.nbUnreadMessages + 1 : state.nbUnreadMessages,
            messagesQa
        };
    }

    case CLEAR_MESSAGES:
        return {
            ...state,
            lastReadMessage: undefined,
            messagesQa: []
        };

    case EDIT_MESSAGE: {
        let found = false;
        const newMessage = action.message;
        const messagesQa = state.messagesQa.map(m => {
            if (m.messageId === newMessage.messageId) {
                found = true;

                return newMessage;
            }

            return m;
        });

        // no change
        if (!found) {
            return state;
        }

        return {
            ...state,
            messagesQa
        };
    }

    case SET_PRIVATE_MESSAGE_RECIPIENT:
        return {
            ...state,
            privateMessageRecipient: action.participant
        };

    case OPEN_CHAT:
        return {
            ...state,
            isOpen: true,
            privateMessageRecipient: action.participant
        };

    case CLOSE_CHAT:
        return {
            ...state,
            isOpen: false,
            lastReadMessage: state.messagesQa[
                navigator.product === 'ReactNative' ? 0 : state.messagesQa.length - 1],
            privateMessageRecipient: action.participant,
            isLobbyChatActive: false
        };

    case SET_IS_POLL_TAB_FOCUSED: {
        return {
            ...state,
            isPollsTabFocused: action.isPollsTabFocused,
            nbUnreadMessages: 0
        }; }

    case SET_LOBBY_CHAT_RECIPIENT:
        return {
            ...state,
            isLobbyChatActive: true,
            lobbyMessageRecipient: action.participant,
            privateMessageRecipient: undefined,
            isOpen: action.open
        };
    case SET_LOBBY_CHAT_ACTIVE_STATE:
        return {
            ...state,
            isLobbyChatActive: action.payload,
            isOpen: action.payload || state.isOpen,
            privateMessageRecipient: undefined
        };
    case REMOVE_LOBBY_CHAT_PARTICIPANT:
        return {
            ...state,
            messagesQa: state.messagesQa.filter(m => {
                if (action.removeLobbyChatMessages) {
                    return !m.lobbyChat;
                }

                return true;
            }),
            isOpen: state.isOpen && state.isLobbyChatActive ? false : state.isOpen,
            isLobbyChatActive: false,
            lobbyMessageRecipient: undefined
        };
    }

    return state;
});
