import { translate } from '../../../base/i18n';
import { Iconraisehanddisable } from '../../../base/icons';

import { AbstractButton } from '../../../base/toolbox/components';

class ReactionsMenuButtonDisable extends AbstractButton<Props, *> {
   
    icon = Iconraisehanddisable;
    label = 'Disble raiseHand';
    toggledLabel = 'Disble raiseHand';

}


export default translate(ReactionsMenuButtonDisable);
