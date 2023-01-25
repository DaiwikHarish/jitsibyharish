import { ApiConstants } from '../../../ApiConstants';
import { ApplicationConstants } from '../../../ApplicationConstants';
import { IStore } from '../app/types';
import { IAttendeeInfo } from '../base/app/types';
import {
    CHAT_ADMIN_ISLOADING_STATUS,
    CHAT_ADMIN_SELECTED_ATTENDEE,
    CHAT_ADMIN_UPDATE_ATTENDEES,
    CHAT_ADMIN_UPDATE_CHAT_HISTORY,
} from './actionTypes';
import { IAPIResponse, IChatDto } from './types';

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
        dispatch({
            type: CHAT_ADMIN_UPDATE_ATTENDEES,
            attendees: attendeeData,
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
                chatHistory: data,
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
        console.log('alam data', data);
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


