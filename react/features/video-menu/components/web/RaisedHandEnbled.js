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
  
    return (
        <ContextMenuItem
          
            icon = { IconRaisedHand }
            spanId="RaisedHandEnbled"
          
            onClick={() => {
              console.log(participantID)
                let text1 = participantID;
                // if (confirm(text1) == true) {
                //   text1 = "You pressed OK!";
                // } else {
                //   text1 = "You canceled!";
                // }
            
                let node = document.getElementById('RaisedHandEnbled');

                let htmlContent = node.textContent;
               
                if(htmlContent.indexOf("Enable")>=0)
                {
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.ENABLE_RAISE_HAND,
                        CommandType.TO_THIS_USER
                    )
                )
                    document.getElementById('RaisedHandEnbled').innerHTML='Disable Raised Hand'
                  
                }else{
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.DISABLE_RAISE_HAND,
                        CommandType.TO_THIS_USER
                    )
                )
                    document.getElementById('RaisedHandEnbled').innerHTML='Enable Raised Hand'
                   
                }
                
              }}
            text = "Enable Raised Hand"
            />
    );
            }

export default RaisedHandEnbled;
