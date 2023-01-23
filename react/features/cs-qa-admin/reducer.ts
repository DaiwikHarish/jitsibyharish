import { IAttendeeInfo, IQuestionAnswer } from '../base/app/types';
import ReducerRegistry from '../base/redux/ReducerRegistry';
import {
    QA_ADMIN_ISLOADING_STATUS,
    QA_ADMIN_UPDATE_LIST,
    QA_SELECTED_QUESTION,
} from './actionTypes';

export interface ICSQaAdminState {
    // api call request/response time
    isLoading?: boolean;
    messageType?: string | null;
    message?: string | null;

    // UI to show
    questionAnswers?: IQuestionAnswer[];
    answered?: number;
    unAnswered?: number;
    total?: number;
    selectedQuestionId?: number | null | undefined;
}

const DEFAULT_STATE: ICSQaAdminState = {
    isLoading: false,
    message: null,
    answered: 0,
    unAnswered: 0,
    total: 0,
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
                    // answered: action.answered,
                    // unAnswered: action.unAnswered,
                    questionAnswers: action?.questionAnswers,
                    total: action?.questionAnswers.length,
                };
                break;
            case QA_SELECTED_QUESTION:
                return {
                    ...state,
                    selectedQuestionId: action?.selectedAQuestionId,
                };
                break;

            default:
                return state;
        }
    }
);
