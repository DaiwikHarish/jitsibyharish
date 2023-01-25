/*******************************************************************
 *  Question & Answers Admin related actions
 *
 */

import { IStore } from '../app/types';
import {
    _deleteQuestion,
    _postAnswer,
    _qaAction,
    _selectedQuestion,
} from './functions';
import { QuestionType } from './types';

/***
 * It is called when user click on refersh button , and on mount of the chat admin page
 */
export function qaAction(
    startDateTime?: string,
    endDateTime?: string,
    questionType?: QuestionType,
    searchText?: string
) {
    console.log("ACTION TRIGGERED qaAction")
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _qaAction(dispatch, getState, startDateTime, endDateTime, questionType, searchText)
    };
}

/***
 * It is called when user click on the Question in the list item
 */
export function selectedQuestion(questionId: string | null) {
     console.log("ACTION TRIGGERED selectedQuestion" )
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
    console.log("ACTION TRIGGERED postAnswer" )
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

export function deleteQuestion(qId: string|null) {
    console.log("ACTION TRIGGERED deleteQuestion" )
    console.log('alam deleteQuestion Initialized.....');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _deleteQuestion(dispatch, getState, qId);
    };
}
