import { isSuboptimalBrowser } from '../base/environment';
import { translateToHTML } from '../base/i18n';
import { NOTIFICATION_TIMEOUT_TYPE, showWarningNotification } from '../notifications';
import { ApiConstants } from '../../../ApiConstants';
export * from './functions.any';

/**
 * Shows the suboptimal experience notification if needed.
 *
 * @param {Function} dispatch - The dispatch method.
 * @param {Function} t - The translation function.
 * @returns {void}
 */
export function maybeShowSuboptimalExperienceNotification(dispatch, t) {
    if (isSuboptimalBrowser()) {
        dispatch(
            showWarningNotification(
                {
                    titleKey: 'notify.suboptimalExperienceTitle',
                    description: translateToHTML(
                        t,
                        'notify.suboptimalBrowserWarning',
                        {
                            recommendedBrowserPageLink: `${window.location.origin}/static/recommendedBrowsers.html`
                        }
                    )
                }, NOTIFICATION_TIMEOUT_TYPE.LONG
            )
        );
    }
}

export function _onKickedOut(id){
    //let url = 'https://dev.awesomereviewstream.com/svr/api/attendee'


    fetch(ApiConstants.attendee,{
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PATCH",     
      
        // Fields that to be updated are passed
        body: JSON.stringify({
          isAllowed: false,
          id: id
        })
    })
    .then((response) => {response.json()})
            .then((data) => {
          
            })
            .catch((err) => {
             
            })

};
