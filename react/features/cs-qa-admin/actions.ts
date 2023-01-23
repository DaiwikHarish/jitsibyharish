/*******************************************************************
 *  Question & Answers Admin related actions
 *
 */

import { IStore } from '../app/types';
import {
    _deleteQuestion,
    _loadQuestionAnswer,
    _postAnswer,
    _selectedQuestion,
} from './functions';

/***
 * It is called when user click on refersh button , and on mount of the chat admin page
 */
export function loadQuestionAnswers(startDate: string, endDate: string) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _loadQuestionAnswer(dispatch, getState, startDate, endDate);
    };
}

/***
 * It is called when user click on the Question in the list item
 */
export function selectedQuestion(questionId: number | null | undefined) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _selectedQuestion(dispatch, getState, questionId);
    };
}

export function postAnswer(newAnswer: string | undefined, sendType: string) {
    console.log('alam sendChatMessage Initialized.....');
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _postAnswer(dispatch, getState, newAnswer, sendType);
    };
}

export function deleteQuestion() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        // Step 1: do process
        _deleteQuestion(dispatch, getState);
    };
}
