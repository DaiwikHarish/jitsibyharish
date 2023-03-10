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

const MuteNewButton = ({ className, noIcon = false, mute, onClick,participantIDbyjitsi, participantID }: Props) => {

  const dispatch = useDispatch();

  let node = document.getElementById(participantIDbyjitsi);
 // let mute=true;

  console.log(participantIDbyjitsi)
if(node!=undefined && node!=null)
{
  // mute = node.getAttribute("data-mute");

}
console.log(mute)


let text="UnMute"
mute==false?text="UnMute":text="Mute"
    return (
        <ContextMenuItem
          
            icon = { IconMicrophone }
            spanId="MuteEnbled"
            onClick={() => {
              console.log(participantID)
             // alert(mute=="false")
                if(mute==false)
                {
                

                
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.UNUTE_MIC,
                        CommandType.TO_THIS_USER
                    )
                )
                if(node!=undefined && node!=null)
{
                node.setAttribute("data-mute","true");
}

                document.getElementById('MuteEnbled').innerHTML='Mute'
                text='Mute'
               // mute='true'
                }else{
                  if(node!=undefined && node!=null)
{
                  node.setAttribute("data-mute","false");
}
                  dispatch(
                    socketSendCommandMessage(
                      participantID.trim(),
                        PermissionType.MUTE_MIC,
                        CommandType.TO_THIS_USER
                    )
                )
          
                document.getElementById('MuteEnbled').innerHTML='UnMute'
                text='UnMute'
                //mute='false'
                }
                
              }}
            text = {text}
            />
    );
            }

export default MuteNewButton;
