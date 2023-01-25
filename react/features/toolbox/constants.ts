/**
 * Thresholds for displaying toolbox buttons.
 */
export const THRESHOLDS = [
    {
        width: 520,
        order: [ 'microphone', 'camera', 'desktop', 'chat', 'QA', 'raisehand', 'participants', 'tileview' ]
    },
    {
        width: 470,
        order: [ 'microphone', 'camera', 'desktop', 'chat', 'QA', 'raisehand', 'participants' ]
    },
    {
        width: 420,
        order: [ 'microphone', 'camera', 'desktop', 'chat', 'QA', 'participants' ]
    },
    {
        width: 370,
        order: [ 'microphone', 'camera', 'chat', 'QA', 'participants' ]
    },
    {
        width: 225,
        order: [ 'microphone', 'camera', 'chat','QA' ]
    },
    {
        width: 200,
        order: [ 'microphone', 'camera' ]
    }
];

export const NOT_APPLICABLE = 'N/A';

export const TOOLBAR_TIMEOUT = 4000;

export const DRAWER_MAX_HEIGHT = '80vh - 64px';

export const NOTIFY_CLICK_MODE = {
    ONLY_NOTIFY: 'ONLY_NOTIFY',
    PREVENT_AND_NOTIFY: 'PREVENT_AND_NOTIFY'
};
