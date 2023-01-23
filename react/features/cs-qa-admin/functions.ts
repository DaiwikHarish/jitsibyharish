import moment from 'moment';
import { ApiConstants } from '../../../ApiConstants';
import { ApplicationConstants } from '../../../ApplicationConstants';
import { IStore } from '../app/types';
import { IQuestionAnswer } from '../base/app/types';
import {
    QA_ADMIN_ISLOADING_STATUS,
    QA_ADMIN_UPDATE_LIST,
    QA_SELECTED_QUESTION,
} from './actionTypes';
import { IAPIResponse } from './types';

/***
 * It is called when user click on refersh button , and on mount of the question & answer admin page
 */
export async function _loadQuestionAnswer(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    startDate?: string,
    endDate?: string
) {
    // Step 1: read here from state if required
    const { questionAnswers, selectedQuestionId } =
        getState()['features/cs-qa-admin'];

    // Step 1: set loading
    dispatch(updateIsLoading(true));
    // Step 2: Call question api
    let apiResponse = await _fetchQuestionAnswers(startDate, endDate);
    let questionAnswerData: IQuestionAnswer[] = [];
    if (apiResponse?.status) {
        questionAnswerData = apiResponse.response;
        dispatch({
            type: QA_ADMIN_UPDATE_LIST,
            questionAnswers: questionAnswerData,
            isLoading: false,
        });
    } else {
        dispatch(updateIsLoading(false, 'ERROR', apiResponse?.message));
    }
}

/***
 * It is called when user click on the Question in the list item
 */

export async function _selectedQuestion(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    selectedAQuestionId: number | null | undefined
) {
    dispatch({
        type: QA_SELECTED_QUESTION,
        selectedAQuestionId: selectedAQuestionId,
    });
}


/***
 * It is called when user click on the Question in the list item
 */
export async function _postAnswer(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    ans: string | undefined,
    sendType: string
) {

    console.log('alam _postAnswer CALLED.....');
    const { questionAnswers, selectedQuestionId } =
        getState()['features/cs-qa-admin'];

    // Step 1: set loading
    dispatch(updateIsLoading(true));

    let answerApiResponse = await _postAnswerApi(ans, selectedQuestionId, sendType);
    if (answerApiResponse?.status) {
        // reloading
        await _loadQuestionAnswer(dispatch, getState);
    } else {
        dispatch(updateIsLoading(false, 'ERROR', answerApiResponse?.message));
    }
}


export async function _deleteQuestion(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
) {
    const { questionAnswers, selectedQuestionId } =
        getState()['features/cs-chat-admin'];

    // do some validation
    let question = questionAnswers?.find((x) => x.id == selectedQuestionId);
    if (question == null || (question && question.id == null)) return;

    // Step 1: set loading
    dispatch(updateIsLoading(true));

    let apiResponse = await _deleteQuestionApi( question.id);
    if (apiResponse?.status) {
        _loadQuestionAnswer(dispatch, getState);
    } else {
        dispatch(updateIsLoading(false, 'ERROR', apiResponse?.message));
    }
}

/****
 * All API calls handled below
 *
 */

async function _fetchQuestionAnswers(startDate: string | undefined, endDate: string | undefined) {
    const url =
        ApplicationConstants.API_BASE_URL +
        'question?meetingId=' +
        ApplicationConstants.meetingId +
        '&startDateTime=' +
        moment(startDate).toISOString().split('.')[0] +
        '&endDateTime=' +
        moment(`${endDate}T23:59:59`).toISOString().split('.')[0] +
        `&questionFilterFlag=Both`;

    let response = await fetch(url);

    if (response.ok && response.status == 200) {
        let data = await response.json();
        console.log('alam data', data);
        let qaArray: IQuestionAnswer[] = [];
                for (let x of data) {
                    if (x.answers.length == 0) {
                        let qa: IQuestionAnswer = {};
                        // question part
                        qa.id = x.id;
                        qa.meetingId = x.meetingId;
                        qa.question = x.question;
                        qa.fromUserId = x.fromUserId;
                        qa.fromUserName = x.fromUserName;
                        qa.createdAt = x.createdAt;
                        qaArray.push(qa);
                    } else {
                        for (let y of x.answers) {
                            let qa: IQuestionAnswer = {};
                            // question part
                            qa.id = x.id;
                            qa.meetingId = x.meetingId;
                            qa.question = x.question;
                            qa.fromUserId = x.fromUserId;
                            qa.fromUserName = x.fromUserName;
                            qa.createdAt = x.createdAt;

                            // answer part
                            qa.answerId = y.id;
                            qa.answer = y.answer;
                            qa.sendTo = y.sendTo;
                            qaArray.push(qa);
                        }
                    }
                }
        let apiResponse: IAPIResponse = {
            response: qaArray,
            status: true,
        };
        return apiResponse;
    } else {
        let apiResponse: IAPIResponse = {
            status: false,
            message: response.statusText,
        };

        return apiResponse;
    }
}

// post answer api
async function _postAnswerApi(
    ans: string | null | undefined,
    qId: number | null | undefined,
    sendType : string
) {
    console.log('alam _postAnswerApi initialized.....');
    let response = await fetch(ApiConstants.answer, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            meetingId: ApplicationConstants.meetingId,
            fromUserId: ApplicationConstants.userId,
            answer: ans,
            questionId: qId,
            sendTo: sendType,
        }),
    });

    let apiResponse: IAPIResponse = { status: false };
    if (response.ok && response.status == 201) {
        let data = await response.json();
        apiResponse.response = data;
        apiResponse.status = true;
    } else {
        apiResponse.message = response.statusText;
        apiResponse.status = false;
    }
    return apiResponse;
}

async function _deleteQuestionApi(
    questionId: number | null | undefined
) {
    let response = await fetch(
        ApplicationConstants.API_BASE_URL +
            'question?meetingId=' +
            ApplicationConstants.meetingId +
            `&questionId=${questionId}`,
        {
            method: 'DELETE',
        }
    );

    let apiResponse: IAPIResponse = { status: false };
    if (response.ok && response.status == 200) {
        let data = await response.json();
        apiResponse.response = data;
        apiResponse.status = true;
    } else {
        apiResponse.message = response.statusText;
        apiResponse.status = false;
    }
    return apiResponse;
}

function updateIsLoading(
    value: boolean,
    meessageType?: string,
    message?: string
) {
    return {
        type: QA_ADMIN_ISLOADING_STATUS,
        isLoading: value,
        messageType: meessageType,
        meessage: message,
    };
}
