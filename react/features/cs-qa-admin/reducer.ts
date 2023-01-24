import { IAttendeeInfo, IQuestionAnswer } from '../base/app/types';
import ReducerRegistry from '../base/redux/ReducerRegistry';
import {
    QA_ADMIN_ISLOADING_STATUS,
    QA_ADMIN_UPDATE_LIST,
    QA_END_DATE,
    QA_SELECTED_QUESTION,
    QA_START_DATE,
} from './actionTypes';

export interface ICSQaAdminState {
    // api call request/response time
    isLoading?: boolean;
    messageType?: string | null;
    message?: string | null;

    // UI to show
    questionAnswers?: IQuestionAnswer[];
    answeredCount?: number;
    unAnsweredCount?: number;
    total?: number;
    startDate: string | Date;
    endDate: string | Date;
    answeredQA: IQuestionAnswer[];
    unAnsweredQA: IQuestionAnswer[];
    selectedQuestionId?: number;
}

const DEFAULT_STATE: ICSQaAdminState = {
    isLoading: false,
    message: null,
    answeredCount: 0,
    unAnsweredCount: 0,
    total: 0,
    startDate: new Date().toLocaleDateString('en-CA'),
    endDate: new Date().toLocaleDateString('en-CA'),
    answeredQA: [],
    unAnsweredQA: [],
    questionAnswers: [],
    selectedQuestionId: undefined,
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
            case QA_ADMIN_UPDATE_LIST:
                return {
                    ...state,
                    isLoading: action.isLoading,
                    questionAnswers: action?.questionAnswers,
                    answeredQA: action?.questionAnswers?.filter(
                        (x) => x.answer !== undefined
                    ),
                    unAnsweredQA: action?.questionAnswers?.filter(
                        (x) => x.answer === undefined
                    ),
                    answeredCount: action?.questionAnswers?.filter(
                        (x) => x.answer !== undefined
                    ).length,
                    unAnsweredCount: action?.questionAnswers?.filter(
                        (x) => x.answer === undefined
                    ).length,
                    total: action?.questionAnswers?.length,
                };
                break;
            case QA_SELECTED_QUESTION:
                return {
                    ...state,
                    selectedQuestionId: action?.selectedAQuestionId,
                };
                break;
            case QA_START_DATE:
                return {
                    ...state,
                    startDate: action?.startDate,
                };
                break;
            case QA_END_DATE:
                return {
                    ...state,
                    endDate: action?.endDate,
                };
                break;

            default:
                return state;
        }
    }
);
