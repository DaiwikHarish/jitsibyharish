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

export const APP_USER_INFO = 'APP_USER_INFO';

export const APP_CLIENT_TYPE = 'APP_CLIENT_TYPE';