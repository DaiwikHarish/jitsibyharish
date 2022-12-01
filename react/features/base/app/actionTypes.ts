/**
 * The type of (redux) action which signals that a specific App will mount (in
 * React terms).
 *
 * {
 *     type: APP_WILL_MOUNT,
 *     app: App
 * }
 */
export const APP_WILL_MOUNT = 'APP_WILL_MOUNT';

/**
 * The type of (redux) action which signals that a specific App will unmount (in
 * React terms).
 *
 * {
 *     type: APP_WILL_UNMOUNT,
 *     app: App
 * }
 */
export const APP_WILL_UNMOUNT = 'APP_WILL_UNMOUNT';

/**
 * The type of (redux) action which signals that a specific app client action will be called
 */
export const APP_CLIENT_TYPE = 'APP_CLIENT_TYPE';

/**
 * The type of (redux) action which signals that a specific app meeting information action will be called
 */
export const APP_MEETING_INFO ='APP_MEETING_INFO'

/**
 * The type of (redux) action which signals that a specific app attendee information action will be called
 */
export const APP_ATTENDEE_INFO ='APP_ATTENDEE_INFO'

/**
 * The type of (redux) action which signals that a specific app meetingId and userId will be fetched from the url
 */
export const APP_URL_INFO ='APP_URL_INFO'