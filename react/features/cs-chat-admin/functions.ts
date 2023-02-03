import moment from 'moment';
import { ApiConstants } from '../../../ApiConstants';
import { ApplicationConstants } from '../../../ApplicationConstants';
import { IStore } from '../app/types';
import { utcToLocal } from '../base/app/functions';
import {
    IAttendeeInfo,
    UI_TIMESTAMP_FORMAT,
    YYYY_MM_DD_T_HH_MM_SS,
} from '../base/app/types';
import {
    CHAT_ADMIN_ISLOADING_STATUS,
    CHAT_ADMIN_SELECTED_ATTENDEE,
    CHAT_ADMIN_UPDATE_ATTENDEES,
    CHAT_ADMIN_UPDATE_CHAT_HISTORY,
    CHAT_ADMIN_UPDATE_UNSEEN_COUNT,
} from './actionTypes';
import {
    IAPIResponse,
    IAttendeeUnSeenCount,
    IChatDto,
    IChatsDto,
} from './types';

/***
 * It is called when user click on refersh button , and on mount of the chat admin page
 */
export async function _loadAttendees(
    dispatch: IStore['dispatch'],
    getState: IStore['getState']
) {
    // Step 1: read here from state if required
    const { attendees, selectedAttendeeId } =
        getState()['features/cs-chat-admin'];

    // Step 1: set loading
    dispatch(updateIsLoading(true));
    // Step 2: Call attendee api
    let apiResponse = await _fetchAttendeeApi();
    let attendeeData: IAttendeeInfo[] = [];
    if (apiResponse?.status) {
        attendeeData = apiResponse.response;
        // copy the existing unseencount
        let newAttendeeUnSeenCount =
            _updateAttendeeUnSeenCountListByAttendeeDto(
                attendees,
                attendeeData
            );

        dispatch({
            type: CHAT_ADMIN_UPDATE_ATTENDEES,
            attendees: _sortAttendeUnseenCount(newAttendeeUnSeenCount),
            isLoading: false,
        });
    } else {
        dispatch(updateIsLoading(false, 'ERROR', apiResponse?.message));
    }

    // Step 3 call chat api
    if (
        selectedAttendeeId &&
        selectedAttendeeId.length > 0 &&
        attendeeData &&
        attendeeData.find((x) => x.userId == selectedAttendeeId)
    ) {
        // Step 1: set loading
        dispatch(updateIsLoading(true));

        let chatApiResponse = await _fetchChatApi(selectedAttendeeId);
        if (chatApiResponse?.status) {
            let data: IChatDto[] = chatApiResponse.response;
            dispatch({
                type: CHAT_ADMIN_UPDATE_CHAT_HISTORY,
                chatHistory: updateChatAPIResponse(data),
                isLoading: false,
            });
        } else {
            dispatch(updateIsLoading(false, 'ERROR', chatApiResponse?.message));
        }
    }
}

/***
 * It is called when user click on the attendee in the list item
 */
export async function _selectedAttendee(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    selectedAttendeeId: string | null | undefined
) {
    const { attendees } = getState()['features/cs-chat-admin'];

    dispatch({
        type: CHAT_ADMIN_SELECTED_ATTENDEE,
        selectedAttendeeId: selectedAttendeeId,
    });

    // Step 1: set loading
    dispatch(updateIsLoading(true));

    let chatApiResponse = await _fetchChatApi(selectedAttendeeId);
    if (chatApiResponse?.status) {
        let data: IChatDto[] = chatApiResponse.response;
        dispatch({
            type: CHAT_ADMIN_UPDATE_CHAT_HISTORY,
            chatHistory: data,
            isLoading: false,
        });

       dispatch(_resetAttendeeCount(selectedAttendeeId, attendees));
    } else {
        dispatch(updateIsLoading(false, 'ERROR', chatApiResponse?.message));
    }
}

export async function _sendChatMessage(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    newMsg: string | undefined
) {
    const { attendees, selectedAttendeeId } =
        getState()['features/cs-chat-admin'];

    // Step 1: set loading
    dispatch(updateIsLoading(true));

    let chatApiResponse = await _postChatApi(newMsg, selectedAttendeeId);
    if (chatApiResponse?.status) {
        let data: IChatDto[] = chatApiResponse.response;
        // reloading
        await _selectedAttendee(dispatch, getState, selectedAttendeeId);
    } else {
        dispatch(updateIsLoading(false, 'ERROR', chatApiResponse?.message));
    }
}

export async function _updateAttendee(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    isAllow: boolean
) {
    const { attendees, selectedAttendeeId } =
        getState()['features/cs-chat-admin'];

    // do some validation
    let attendee = attendees?.find((x) => x.userId == selectedAttendeeId);
    if (attendee == null || (attendee && attendee.id == null)) return;

    // Step 1: set loading
    dispatch(updateIsLoading(true));

    let apiResponse = await _patchAttendeeApi(isAllow, attendee.id);
    if (apiResponse?.status) {
        _loadAttendees(dispatch, getState);
    } else {
        dispatch(updateIsLoading(false, 'ERROR', apiResponse?.message));
    }
}

async function _fetchAttendeeApi() {
    let response = await fetch(
        ApiConstants.attendee + '?meetingId=' + ApplicationConstants.meetingId
    );

    if (response.ok && response.status == 200) {
        let data = await response.json();
        let apiResponse: IAPIResponse = {
            response: data,
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

async function _fetchChatApi(userId: string | null | undefined) {
    let response = await fetch(
        ApplicationConstants.API_BASE_URL +
            'chat?meetingId=' +
            ApplicationConstants.meetingId +
            `&userId=${userId}`
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

function updateChatAPIResponse(data: IChatDto[]): IChatDto[] {
    for (let x of data) {
        x.createdAt = utcToLocal(x.createdAt ? x.createdAt : '');
        x.updatedAt = utcToLocal(x.updatedAt ? x.updatedAt : '');
    }

    return data;
}

async function _postChatApi(
    newMesg: string | null | undefined,
    toUserId: string | null | undefined
) {
    let response = await fetch(ApiConstants.chat, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',

        // Fields that to be updated are passed
        body: JSON.stringify({
            meetingId: ApplicationConstants.meetingId,
            fromUserId: ApplicationConstants.userId,
            toUserId: toUserId,
            message: newMesg,
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

async function _patchAttendeeApi(
    isAllow: boolean,
    attendeeId: string | null | undefined
) {
    let response = await fetch(ApiConstants.attendee, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'PATCH',

        // Fields that to be updated are passed
        body: JSON.stringify({
            isAllowed: isAllow,
            id: attendeeId,
        }),
    });

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
        type: CHAT_ADMIN_ISLOADING_STATUS,
        isLoading: value,
        messageType: meessageType,
        meessage: message,
    };
}

export function uiTimeFormat(dateString: string) {
    return moment(dateString, YYYY_MM_DD_T_HH_MM_SS).format(
        UI_TIMESTAMP_FORMAT
    );
}

export async function _updateOnlineAttendeeDataFromSocket(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    attendeeData: IAttendeeInfo
) {
    let attendeeUnSeenCount = getState()['features/cs-chat-admin'].attendees;

    attendeeData.updatedAt = utcToLocal(attendeeData.updatedAt);

    let newAttendeeUnSeenCount = _updateAttendeeUnSeenCountListBySocketAttendeeDto(
        attendeeUnSeenCount,
        attendeeData
    );

    dispatch({
        type: CHAT_ADMIN_UPDATE_ATTENDEES,
        attendees: newAttendeeUnSeenCount,
        isLoading: false,
    });
}

/// update for socket chat dto message
export async function _updateChatDataFromSocket(
    dispatch: IStore['dispatch'],
    getState: IStore['getState'],
    socketChatDto: IChatDto
) {
    let selectedAttedeeUserId =
        getState()['features/cs-chat-admin'].selectedAttendeeId;
    let stateChatData = getState()['features/cs-chat-admin'].chatHistory;
    let isScreenON = getState()['features/cs-chat-admin']?.isScreenON;
    let unSeenCount = getState()['features/cs-chat-admin'].unSeenCount;
    let attendeeUnSeenCount = getState()['features/cs-chat-admin'].attendees;

    socketChatDto.updatedAt = utcToLocal(socketChatDto.updatedAt);

    if (
        selectedAttedeeUserId == socketChatDto.fromUserId &&
        isScreenON == true
    ) {
        let newData: IChatDto[] = _updateChatDataBySocketChatDto(
            socketChatDto,
            stateChatData
        );
        dispatch({
            type: CHAT_ADMIN_UPDATE_CHAT_HISTORY,
            chatHistory: newData,
            isLoading: false,
        });
    } else {
        // chat admin screen is closed , then update the count and updateAt
        let newAttendeeUnSeenCount = _updateUnSeenCountBySocketChatDto(
            socketChatDto,
            attendeeUnSeenCount
        );

        let count: number = 0;
        for (let x of newAttendeeUnSeenCount) {
            count = count + x.unSeenCount;
        }

        dispatch({
            type: CHAT_ADMIN_UPDATE_UNSEEN_COUNT,
            unSeenCount: count,
            attendees: _sortAttendeUnseenCount(newAttendeeUnSeenCount),
        });
    }
}



function _updateChatDataBySocketChatDto(
    socketChatData: IChatDto,
    stateChatData: IChatDto[]
): IChatDto[] {
    let chatData: IChatDto[] = [...stateChatData];
    chatData.push(socketChatData);
    return chatData;
}

// To call by attendee api response or socket online attendee
function _updateAttendeeUnSeenCountListByAttendeeDto(
    stateAttendeeUnSeenCount: IAttendeeUnSeenCount[],
    apiAttendees: IAttendeeInfo[]
): IAttendeeUnSeenCount[] {
    let newAttendeeUnSeenCount: IAttendeeUnSeenCount[] = [];

    for (let apiData of apiAttendees) {
        let stateData = stateAttendeeUnSeenCount.find(
            (y) => y.userId == apiData.userId
        );
        let newData: IAttendeeUnSeenCount = { ...apiData, unSeenCount: 0 };
        if (stateData) {
            newData.unSeenCount = stateData.unSeenCount;

            // update updateAt column , take latest one
            let stateDataUpdateAt = moment(
                stateData.updatedAt,
                YYYY_MM_DD_T_HH_MM_SS
            );
            let newDataUpdateAt = moment(
                newData.updatedAt,
                YYYY_MM_DD_T_HH_MM_SS
            );
            if (newDataUpdateAt.isBefore(stateDataUpdateAt)) {
                newData.updatedAt = stateData.updatedAt;
            }
        }
        newAttendeeUnSeenCount.push(newData);
    }

    return newAttendeeUnSeenCount;
}

function _updateAttendeeUnSeenCountListBySocketAttendeeDto(
    stateAttendeeUnSeenCount: IAttendeeUnSeenCount[],
    apiAttendee: IAttendeeInfo
): IAttendeeUnSeenCount[] {
    let newAttendeeUnSeenCount: IAttendeeUnSeenCount[] = [
        ...stateAttendeeUnSeenCount,
    ];

    let dataArray = newAttendeeUnSeenCount.filter(
        (x) => x.userId !== apiAttendee.userId
    );

    let existData = newAttendeeUnSeenCount.find(
        (x) => x.userId == apiAttendee.userId
    );

    let newData: IAttendeeUnSeenCount;
    if (existData) {
        newData = {
            ...apiAttendee,
            unSeenCount: existData.unSeenCount,
        };
    } else {
        newData = {
            ...apiAttendee,
            unSeenCount: 0,
        };
    }

    dataArray.push(newData);

    return dataArray;
}

// To call by socket chat message
function _updateUnSeenCountBySocketChatDto(
    socketChatData: IChatDto,
    stateAttendeeUnSeenCount: IAttendeeUnSeenCount[]
): IAttendeeUnSeenCount[] {
    let attendeeUnSeenCount: IAttendeeUnSeenCount[] = [
        ...stateAttendeeUnSeenCount,
    ];

    for (let x of attendeeUnSeenCount) {
        if (x && x.userId == socketChatData.fromUserId) {
            x.unSeenCount++;
            x.updatedAt = socketChatData.updatedAt;
            break;
        }
    }

    return attendeeUnSeenCount;
}

function _sortAttendeUnseenCount(
    data: IAttendeeUnSeenCount[]
): IAttendeeUnSeenCount[] {
    let newArray: IAttendeeUnSeenCount[] = [...data];
    return newArray.sort((a, b) => {
        return _comapreTwoDates(a.updatedAt, b.updatedAt);
    });
}

function _comapreTwoDates(a: string, b: string) {
    let aDateTime = moment(a, YYYY_MM_DD_T_HH_MM_SS);
    let bDateTime = moment(b, YYYY_MM_DD_T_HH_MM_SS);

    if (aDateTime.isBefore(bDateTime)) {
        return -1;
    } else if (aDateTime.isAfter(bDateTime)) {
        return 1;
    } else {
        return 0;
    }
}

// reset attendee count when user select the attendee
function _resetAttendeeCount(
    userId: string | null | undefined,
    stateAttendeeUnSeenCount: IAttendeeUnSeenCount[]
) {
    let attendeeUnSeenCount: IAttendeeUnSeenCount[] = [
        ...stateAttendeeUnSeenCount,
    ];

    for (let x of attendeeUnSeenCount) {
        if (x && x.userId == userId) {
            x.unSeenCount = 0;
        }
    }

    let count: number = 0;
    for (let x of attendeeUnSeenCount) {
        count = count + x.unSeenCount;
    }

    return {
        type: CHAT_ADMIN_UPDATE_UNSEEN_COUNT,
        unSeenCount: count,
        attendees: attendeeUnSeenCount,
    };
}
