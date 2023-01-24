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
