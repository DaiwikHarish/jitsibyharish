import moment from 'moment';
import ReducerRegistry from '../base/redux/ReducerRegistry';
import {
    QA_ADMIN_ISLOADING_STATUS,
    QA_SELECTED_QUESTION,
    QA_STATE_UPDATE,
} from './actionTypes';
import { IQuestionAnswer,  QuestionType } from './types';

export interface ICSQaAdminState {

    // api call request/response
    isLoading: boolean;
    messageType: string | null;
    message: string | null;

    // qa data
    qaData: IQuestionAnswer[];

    // what question type selected by user     
    questionType:QuestionType;

    // what is from and to date selected by user 
    startDateTime: string ;
    endDateTime: string ;
    
    // what is search text 
    searchText:string | null;

    // selected question to highlight
    selectedQuestionId: string | null;
}

const DEFAULT_STATE: ICSQaAdminState = {
    isLoading: false,
    messageType: null,
    message: null,
   
    // api response 
    qaData: [],

    questionType:QuestionType.NotAnswered,

    startDateTime:  moment().format('YYYY-MM-DD') + 'T00:00:00',
    endDateTime: moment().format('YYYY-MM-DD') + 'T23:59:59',
    
    searchText:null,
    selectedQuestionId: null,
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
                    qaData:action.qaData,
                    questionType:action.questionType,
                    startDateTime:action.startDateTime,
                    endDateTime:action.endDateTime,
                    searchText:action.searchText,
                    isLoading:action.isloading
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


