import { isSuboptimalBrowser } from '../base/environment';
import { translateToHTML } from '../base/i18n';
import { NOTIFICATION_TIMEOUT_TYPE, showWarningNotification } from '../notifications';

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
    let url = 'https://dev.awesomereviewstream.com/svr/api/attendee'
    console.log("alam updateId",id)

    fetch(url,{
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
    .then((response) => {console.log("alam response",response); response.json()})
            .then((data) => {
               console.log("alam Successfully updated")
            })
            .catch((err) => {
                console.log("alam kickout error",err.message);
            })

};
