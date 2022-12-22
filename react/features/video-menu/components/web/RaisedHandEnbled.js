// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import { socketSendCommandMessage } from "../../../base/cs-socket/actions";
import { CommandMessageDto, CommandType, PermissionType } from "../../../base/cs-socket/types";
import { IconRaisedHand } from '../../../base/icons';
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

const RaisedHandEnbled = ({ className, noIcon = false, onClick,participantIDbyjitsi, participantID }: Props) => {

  const dispatch = useDispatch();
  let node = document.getElementById(participantIDbyjitsi);
  let raisehand=true;
if(node!=undefined)
{
  raisehand = node.getAttribute("data-raisehand");

}
  
let text="Enable Raised Hand"
raisehand=="false"?text="Enable Raised Hand":text="Disable Raised Hand"
    return (
        <ContextMenuItem
          
            icon = { IconRaisedHand }
            spanId="RaisedHandEnbled"
          
            onClick={() => {
              
            
              if(raisehand=="false")
              {
                text='Disable Raised Hand'
              
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.ENABLE_RAISE_HAND,
                        CommandType.TO_THIS_USER
                    )
                )
                node.setAttribute("data-raisehand","true");
            
                    document.getElementById('RaisedHandEnbled').innerHTML='Disable Raised Hand'
                  
                  
                }else{
                  text='Enable Raised Hand'
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.DISABLE_RAISE_HAND,
                        CommandType.TO_THIS_USER
                    )
                )
                node.setAttribute("data-raisehand","false");
               
                    document.getElementById('RaisedHandEnbled').innerHTML='Enable Raised Hand'
                   
                }
                
            }}
            text = {text}
            />
    );
            }

export default RaisedHandEnbled;
