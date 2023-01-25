export interface IAPIResponse {
    response?: any;
    status: boolean;
    message?: string;
}

export enum QuestionType {
    NotAnswered = 'NotAnswered',
    Answered = 'Answered',
    Both = 'Both',
}
export interface IAnswerDto {
    id: string;
    meetingId: string;
    fromUserId: string;
    fromUserName: string;
    fromUserType: string;
    fromUserEmailId: string;
    fromUserMobileNr: string;
    answer: string;
    questionId: string;
    sendTo: string;
    createdAt: string;
    updatedAt: string;
}
export interface IQuestionDto {
    id: string;
    meetingId: string;
    fromUserId: string;
    fromUserName: string;
    fromuserType: string;
    fromUserEmailId: string;
    fromUserMobileNr: string;
    question: string;
    createdAt: string;
    updatedAt: string;
}

export interface IQuestionAnswerDto  extends IQuestionDto{
  answers?: IAnswerDto[];
}

export interface IQuestionsDto {
  data: IQuestionAnswerDto[];
  total: number;
}

export enum SendToTypes {
    sendToUser = 'Send To User',
    sendToAll = 'Send To All',
}

export interface IQuestionAnswer {
    meetingId?: string;
    questionId: string;
    question?: string;
    fromUserId?: string;
    fromUserName?: string;
    fromUserType?: string;
    fromUserEmailId?: string;
    fromUserMobileNr?: string;
    questionCreatedAt: string;
    questionUpdatedAt: string;
    answeredFlag?: boolean;
    sendTo?: string;
    answerId?: string;
    answer?: string;
    answerUserId?: string;
    answerUserName?: string;
    answerUserType?: string;
    answerUserEmailId?: string;
    answerUserMobileNr?: string;
    answerCreatedAt?: string;
    answerUpdatedAt?: string;
}
