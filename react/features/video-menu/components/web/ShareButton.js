// @ts-ignore
// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import { socketSendCommandMessage } from "../../../base/cs-socket/actions";
import { CommandMessageDto, CommandType, PermissionType } from "../../../base/cs-socket/types";
import { IconShareDesktop } from '../../../base/icons';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';
type Props = {

    /**
     * Button text class name.
     */
    className: string,

    /**
     * Whether the icon should be hidden or not.
     */
    noIcon: boolean,

    /**
     * Click handler executed aside from the main action.
     */
    onClick?: Function,

    /**
     * The ID for the participant on which the button will act.
     */
    participantID: string,

    participantIDbyjitsi:string
}

const ShareButton = ({ className, noIcon = false, onClick,participantIDbyjitsi, participantID }: Props) => {

  const dispatch = useDispatch();
  
    return (
        <ContextMenuItem
          
            icon = { IconShareDesktop }
            spanId="sreenshare"
          
            onClick={() => {
              console.log(participantID)
                let text1 = participantID;
                // if (confirm(text1) == true) {
                //   text1 = "You pressed OK!";
                // } else {
                //   text1 = "You canceled!";
                // }
            
                let node = document.getElementById('sreenshare');

                let htmlContent = node.textContent;
               
                if(htmlContent.indexOf("Enable")>=0)
                {
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.ENABLE_SCREEN_SHARE,
                        CommandType.TO_THIS_USER
                    )
                )
                    document.getElementById('sreenshare').innerHTML='Disable Screen Share'
                  
                }else{
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.DISABLE_SCREEN_SHARE,
                        CommandType.TO_THIS_USER
                    )
                )
                    document.getElementById('sreenshare').innerHTML='Enable Screen Share'
                   
                }
                
              }}
            text = "Enable Screen Share"
            />
    );
            }

export default ShareButton;
