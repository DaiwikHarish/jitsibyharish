import moment from 'moment';
import { ApiConstants } from '../../../ApiConstants';
import { ApplicationConstants } from '../../../ApplicationConstants';
import { IStore } from '../app/types';
import { localToUTC, utcToLocal } from '../base/app/functions';
import { UI_DATE_FORMAT, YYYY_MM_DD_T_HH_MM_SS } from '../base/app/types';
import {
    QA_ADMIN_ISLOADING_STATUS,
    QA_SELECTED_QUESTION,
    QA_STATE_UPDATE,
    QA_UPDATE_QA_DATA,
    QA_UPDATE_UNSEEN_COUNT,
} from './actionTypes';
import { ICSQaAdminState } from './reducer';
import {
    IAPIResponse,
    IQuestionAnswer,
    IQuestionAnswerDto,
    QuestionType,
} from './types';

/***
 * It is called when user click on refersh button , and on mount of the question & answer admin page
 */
export async function _qaAction(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    inputStartDateTime?: string,
    inputEndDateTime?: string,
    inputQuestionType?: QuestionType,
    inputSearchText?: string
) {
    // Step 1: read here from state if required
    const { startDateTime, endDateTime, questionType, searchText, qaData } =
        getState()['features/cs-qa-admin'];

    let triggerApi: boolean = false;
    if (inputStartDateTime || inputEndDateTime) {
        triggerApi = true;
    }

    let xStartDateTime = inputStartDateTime
        ? inputStartDateTime
        : startDateTime;

    let xEndDateTime = inputEndDateTime ? inputEndDateTime : endDateTime;
    let xQuestionType = inputQuestionType ? inputQuestionType : questionType;
    let xSearchText = inputSearchText ? inputSearchText : searchText;
    if (xSearchText == 'CS_EMPTY') {
        xSearchText = '';
    }
    let xQAData: IQuestionAnswer[] = qaData;

    if (triggerApi) {
        // Step 1: set loading
        dispatch(updateIsLoading(true));
        let apiResponse = await _fetchQuestionAnswers(
            localToUTC(xStartDateTime),
            localToUTC(xEndDateTime)
        );
        if (apiResponse?.status) {
            xQAData = apiResponse.response;
        } else {
            dispatch(updateIsLoading(false, 'ERROR', apiResponse?.message));
        }
    }

    // update state
    dispatch({
        type: QA_STATE_UPDATE,
        qaData: xQAData,
        startDateTime: xStartDateTime,
        endDateTime: xEndDateTime,
        questionType: xQuestionType,
        searchText: xSearchText,
        isLoading: false,
    });
}

/***
 * It is called when user click on the Question in the list item
 */

export async function _selectedQuestion(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    selectedAQuestionId: string | null
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
    ans: string | null,
    selectedQuestionId: string | null,
    sendType: string
) {
    const { startDateTime, endDateTime } = getState()['features/cs-qa-admin'];
    // Step 1: set loading
    dispatch(updateIsLoading(true));
    if (ans === null || ans === undefined || ans === '') {
        return dispatch(updateIsLoading(false));
    }
    let answerApiResponse = await _postAnswerApi(
        ans,
        selectedQuestionId,
        sendType
    );
    if (answerApiResponse?.status) {
        // reloading
        await _qaAction(dispatch, getState, startDateTime, endDateTime);
    } else {
        dispatch(updateIsLoading(false, 'ERROR', answerApiResponse?.message));
    }
}

export async function _deleteQuestion(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    qId: string | null
) {
    const { startDateTime, endDateTime } = getState()['features/cs-qa-admin'];
    console.log('alam delete questionId CALLED.....', qId);
    // Step 1: set loading
    dispatch(updateIsLoading(true));

    let apiResponse = await _deleteQuestionApi(qId);
    if (apiResponse?.status) {
        console.log('alam success apiResponse.....', apiResponse);
        _qaAction(dispatch, getState, startDateTime, endDateTime);
    } else {
        console.log('alam Error apiResponse.....', apiResponse?.message);
        dispatch(updateIsLoading(false, 'ERROR', apiResponse?.message));
    }
}

/****
 * All API calls handled below
 *
 */

async function _fetchQuestionAnswers(
    startDateTime: string | undefined,
    endDateTime: string | undefined
) {
    const url =
        ApplicationConstants.API_BASE_URL +
        'question?meetingId=' +
        ApplicationConstants.meetingId +
        '&startDateTime=' +
        startDateTime +
        '&endDateTime=' +
        endDateTime +
        `&questionFilterFlag=Both`;

    let response = await fetch(url);

    if (response.ok && response.status == 200) {
        let data: IQuestionAnswerDto[] = await response.json();

        let apiResponse: IAPIResponse = {
            response: _mergeQAData(data),
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
    ans: string | null,
    qId: string | null,
    sendType: string
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

async function _deleteQuestionApi(questionId: string | null) {
    console.log('alam _deleteQuestionApi CALLED.....', questionId);
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

function _mergeQAData(qa: IQuestionAnswerDto[]): IQuestionAnswer[] {
    let qaMergedDataArray: IQuestionAnswer[] = [];

    // for each question
    for (let question of qa) {
        let questionData: IQuestionAnswer = {
            meetingId: question.meetingId,
            questionId: question.id,
            question: question.question,
            fromUserId: question.fromUserId,
            fromUserName: question.fromUserName,
            fromUserType: question.fromuserType,
            fromUserEmailId: question.fromUserEmailId,
            fromUserMobileNr: question.fromUserMobileNr,
            questionCreatedAt: uiFormat(utcToLocal(question.createdAt)),
            questionUpdatedAt: uiFormat(utcToLocal(question.updatedAt)),
            answeredFlag: false,
            sendTo: '',
            answerId: '',
            answer: '',
            answerUserId: '',
            answerUserName: '',
            answerUserType: '',
            answerUserEmailId: '',
            answerUserMobileNr: '',
            answerCreatedAt: '',
            answerUpdatedAt: '',
        };

        // for each answer for a question
        if (question.answers) {
            for (let answer of question.answers) {
                let qaMergedData: IQuestionAnswer = {
                    ...questionData,
                    answeredFlag: true,
                    sendTo: answer.sendTo,
                    answerId: answer.id,
                    answer: answer.answer,
                    answerUserId: answer.fromUserId,
                    answerUserName: answer.fromUserName,
                    answerUserType: answer.fromUserType,
                    answerUserEmailId: answer.fromUserEmailId,
                    answerUserMobileNr: answer.fromUserMobileNr,
                    answerCreatedAt: uiFormat(utcToLocal(answer.createdAt)),
                    answerUpdatedAt: uiFormat(utcToLocal(answer.updatedAt)),
                };

                qaMergedDataArray.push(qaMergedData);
            }
        }

        // if no answers , just push one row with question no answer
        if (question.answers && question.answers.length == 0) {
            qaMergedDataArray.push(questionData);
        }
    }

    return qaMergedDataArray;
}

function uiFormat(dateString: string) {
    return moment(dateString, YYYY_MM_DD_T_HH_MM_SS).format(UI_DATE_FORMAT);
}

/********************
 *
 *    UI methods
 */

export function applySearchFilter(
    qaData: IQuestionAnswer[],
    searchText: string | null
) {
    let searchResult: IQuestionAnswer[] = [];

    if (searchText && searchText.length > 0) {
        for (let x of qaData) {
            if (
                x.question?.toLowerCase().includes(searchText) ||
                x.answer?.toLowerCase().includes(searchText) ||
                x.fromUserName?.toLowerCase().includes(searchText) ||
                x.questionCreatedAt?.toLowerCase().includes(searchText)
            ) {
                searchResult.push(x);
            }
        }
        return searchResult;
    }

    return qaData;
}

// filter by selected question type and search text
export function getQaData(qaState: ICSQaAdminState) {
    let afterFilterqaData: IQuestionAnswer[] = [];

    if (qaState == null || qaState.qaData == null) return [];

    if (qaState?.questionType == QuestionType.Answered) {
        afterFilterqaData = qaState?.qaData.filter(
            (x) => x.answeredFlag == true
        );
    } else if (qaState.questionType == QuestionType.NotAnswered) {
        afterFilterqaData = qaState?.qaData.filter(
            (x) => x.answeredFlag == false
        );
    } else {
        afterFilterqaData = qaState?.qaData;
    }

    let data = applySearchFilter(afterFilterqaData, qaState.searchText);
    console.log('TRIGGER qaData', data);
    return data;
}

export function getQuestionTypeCount(
    qaState: ICSQaAdminState,
    questionType: QuestionType
) {
    if (qaState == null || qaState.qaData == null) return 0;

    if (questionType == QuestionType.Answered) {
        return qaState.qaData.filter((x) => x.answeredFlag == true).length;
    } else if (questionType == QuestionType.NotAnswered) {
        return qaState.qaData.filter((x) => x.answeredFlag == false).length;
    } else {
        return qaState.qaData.length;
    }
}

//////// update question object from socket ///////

export async function _updateQADataFromSocket(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    socketQAData: IQuestionAnswerDto
) {
    let stateQAData = getState()['features/cs-qa-admin'].qaData;
    let isScreenON = getState()['features/cs-qa-admin']?.isScreenON;
    let unSeenCount = getState()['features/cs-qa-admin'].unSeenCount;

    if (isScreenON) {
        let qaData = _updateQAData(socketQAData, stateQAData);
        dispatch({
            type: QA_UPDATE_QA_DATA,
            qaData: qaData,
        });
    } else {
        dispatch({
            type: QA_UPDATE_UNSEEN_COUNT,
            unSeenCount: unSeenCount+1,
        });
    }

}

export function _updateQAData(
    socketQAData: IQuestionAnswerDto,
    stateQAData: IQuestionAnswer[]
): IQuestionAnswer[] {
    // clone it existing
    let updatedData: IQuestionAnswer[] = [];

    for (let x of stateQAData) {
        // copy all questions except socket questionId
        if (x.questionId != socketQAData.id) {
            let data: IQuestionAnswer = { ...x };
            updatedData.push(data);
        }
    }

    // add socket question  at the end
    let mergeQAData = _mergeQAData([socketQAData]);
    updatedData.push(mergeQAData[0]);

    return updatedData;
}
