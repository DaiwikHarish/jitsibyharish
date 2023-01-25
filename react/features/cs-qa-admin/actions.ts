/*******************************************************************
 *  Question & Answers Admin related actions
 *
 */

import { IStore } from '../app/types';
import UserType from '../base/app/types';
import { QA_UPDATE_SCREEN_ON_STATUS, QA_UPDATE_UNSEEN_COUNT } from './actionTypes';
import {
    _deleteQuestion,
    _postAnswer,
    _qaAction,
    _selectedQuestion,
    _updateQADataFromSocket,
} from './functions';
import { IQuestionAnswerDto, QuestionType } from './types';

/***
 * It is called when user click on refersh button , and on mount of the chat admin page
 */
export function qaAction(
    startDateTime?: string,
    endDateTime?: string,
    questionType?: QuestionType,
    searchText?: string
) {
    console.log('ACTION TRIGGERED qaAction');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _qaAction(
            dispatch,
            getState,
            startDateTime,
            endDateTime,
            questionType,
            searchText
        );
    };
}

/***
 * It is called when user click on the Question in the list item
 */
export function selectedQuestion(questionId: string | null) {
    console.log('ACTION TRIGGERED selectedQuestion');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _selectedQuestion(dispatch, getState, questionId);
    };
}

export function postAnswer(
    newAnswer: string | null,
    selectedQuestionId: string | null,
    sendType: string
) {
    console.log('ACTION TRIGGERED postAnswer');
    console.log('alam sendChatMessage Initialized.....');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _postAnswer(
            dispatch,
            getState,
            newAnswer,
            selectedQuestionId,
            sendType
        );
    };
}

export function deleteQuestion(qId: string | null) {
    console.log('ACTION TRIGGERED deleteQuestion');
    console.log('alam deleteQuestion Initialized.....');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _deleteQuestion(dispatch, getState, qId);
    };
}

export function updateQAScreenStatus(value: boolean) {
    return {
        type: QA_UPDATE_SCREEN_ON_STATUS,
        isScreenON: value,
    };
}

export function updateQADataFromSocket(qaData: IQuestionAnswerDto) {
    console.log('alam updateQADataFromSocket Initialized.....');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        let attendeeInfo = getState()['features/base/app']?.attendeeInfo;
        if (
            attendeeInfo &&
            (attendeeInfo.userType == UserType.Presenter ||
                attendeeInfo.userType == UserType.Admin)
        ) {
            _updateQADataFromSocket(dispatch, getState, qaData);
        }
    };
}

export function resetQAUnSeenCount() {
    return {
            type: QA_UPDATE_UNSEEN_COUNT,
            unSeenCount: 0,
        }
}