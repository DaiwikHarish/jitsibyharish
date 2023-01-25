import moment from 'moment';
import { dumpLog } from '../app/functions.any';
import ReducerRegistry from '../base/redux/ReducerRegistry';
import {
    QA_ADMIN_ISLOADING_STATUS,
    QA_SELECTED_QUESTION,
    QA_STATE_UPDATE,
    QA_UPDATE_QA_DATA,
    QA_UPDATE_SCREEN_ON_STATUS,
    QA_UPDATE_UNSEEN_COUNT,
} from './actionTypes';
import { IQuestionAnswer, QuestionType } from './types';

export interface ICSQaAdminState {
    // api call request/response
    isLoading: boolean;
    messageType: string | null;
    message: string | null;

    // qa data
    qaData: IQuestionAnswer[];

    // what question type selected by user
    questionType: QuestionType;

    // what is from and to date selected by user
    startDateTime: string;
    endDateTime: string;

    // what is search text
    searchText: string | null;

    // selected question to highlight
    selectedQuestionId: string | null;

    // To indicate whether qa screen opened or closed
    isScreenON: boolean;
    unSeenCount: number

}

const DEFAULT_STATE: ICSQaAdminState = {
    isLoading: false,
    messageType: null,
    message: null,

    // api response
    qaData: [],

    questionType: QuestionType.NotAnswered,

    startDateTime: moment().format('YYYY-MM-DD') + 'T00:00:00',
    endDateTime: moment().format('YYYY-MM-DD') + 'T23:59:59',

    searchText: null,
    selectedQuestionId: null,

    isScreenON: false,
    unSeenCount: 0
};

ReducerRegistry.register<ICSQaAdminState>(
    'features/cs-qa-admin',
    (state = DEFAULT_STATE, action): ICSQaAdminState => {
        switch (action.type) {
            case QA_ADMIN_ISLOADING_STATUS:
                if (action?.messageType) {
                    return {
                        ...state,
                        isLoading: action.isLoading,
                        messageType: action?.messageType,
                        message: action?.message,
                    };
                } else {
                    return {
                        ...state,
                        isLoading: action.isLoading,
                    };
                }
                break;
            case QA_STATE_UPDATE:
                return {
                    ...state,
                    qaData: action.qaData,
                    questionType: action.questionType,
                    startDateTime: action.startDateTime,
                    endDateTime: action.endDateTime,
                    searchText: action.searchText,
                    isLoading: action.isLoading,
                };
                break;
            case QA_SELECTED_QUESTION:
                return {
                    ...state,
                    selectedQuestionId: action?.selectedAQuestionId,
                };
                break;
            case QA_UPDATE_SCREEN_ON_STATUS:
                return {
                    ...state,
                    isScreenON: action.isScreenON,
                };
                break;
            case QA_UPDATE_QA_DATA:
                return {
                    ...state,
                    qaData: action.qaData,
                };
                break;
            case QA_UPDATE_UNSEEN_COUNT:
                return {
                    ...state,
                    unSeenCount: action.unSeenCount,
                };
                break;    
            default:
                return state;
        }
    }
);
