// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import { socketSendCommandMessage } from "../../../base/cs-socket/actions";
import { CommandMessageDto, CommandType, PermissionType } from "../../../base/cs-socket/types";
import { IconMicrophone } from '../../../base/icons';
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

const MuteNewButton = ({ className, noIcon = false, onClick,participantIDbyjitsi, participantID }: Props) => {

  const dispatch = useDispatch();
  
  let spanId="MuteNewButton"+participantID
    return (
        <ContextMenuItem
          
            icon = { IconMicrophone }
            spanId={spanId}
          
            onClick={() => {
              console.log(spanId)
                let text1 = participantID;
                // if (confirm(text1) == true) {
                //   text1 = "You pressed OK!";
                // } else {
                //   text1 = "You canceled!";
                // }
            
                let node = document.getElementById('MuteNewButton'+participantID);

                let htmlContent = node.textContent;
               
                if(htmlContent.indexOf("Un")>=0)
                {
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.MUTE_MIC,
                        CommandType.TO_THIS_USER
                    )
                )
                    document.getElementById('MuteNewButton'+participantID).innerHTML='Mute'
                  
                }else{
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.UNUTE_MIC,
                        CommandType.TO_THIS_USER
                    )
                )
                    document.getElementById('MuteNewButton'+participantID).innerHTML='UnMute'
                   
                }
                
              }}
            text = "UnMute"
            />
    );
            }

export default MuteNewButton;
