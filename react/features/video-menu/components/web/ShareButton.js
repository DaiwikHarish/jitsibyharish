// @ts-ignore
// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
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
  const queryString = window.location.search;
      

  const urlParams = new URLSearchParams(queryString);

  const meetingId = urlParams.get('meetingId')
  const userId = urlParams.get('userId')
  const [ sreenshare, setsreenshareEvent ] = useState(false);
 


  useEffect(() => {
  
    let url = 'https://dev.awesomereviewstream.com/svr/api/attendee?meetingId='+meetingId+'&userId='+ participantID.trim();
 

    fetch(
      url
  )
      .then((response) => response.json())
      .then((data) => {

         
if(data.length>0)
{
          if(data[0]!=undefined && data[0].isScreenShare==false)
          {
           

            setsreenshareEvent(false)
         
          }


          if(data[0]!=undefined && data[0].isScreenShare==true)
          {
            setsreenshareEvent(true)
           
          }
        }
 
            })
}, [participantID]);

      

    return (
      <ContextMenuItem
        
          icon = { IconShareDesktop }
         spanId="sreenshare"
        
          onClick={() => {
           
            console.log(participantID)
             
              if(sreenshare==false)
              {
                
                dispatch(
                  socketSendCommandMessage(
                    participantID.trim(),
                      PermissionType.ENABLE_SCREEN_SHARE,
                      CommandType.TO_THIS_USER
                  )
              )
         
              setsreenshareEvent(true)
          
             
              }else{
             
                dispatch(
                  socketSendCommandMessage(
                    participantID.trim(),
                      PermissionType.DISABLE_SCREEN_SHARE,
                      CommandType.TO_THIS_USER
                  )
              )
              
           
              setsreenshareEvent(false)       
            
              }
              
            }}
          text = {sreenshare==false?"Enable Sreen share":"Disable Sreen share"}
          />
  );
          }

export default ShareButton;
