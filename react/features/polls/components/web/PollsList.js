// @flow

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { COMMAND_NEW_POLL } from '../../constants';

import { Icon, IconChatUnread } from '../../../base/icons';
import { browser } from '../../../base/lib-jitsi-meet';

import PollItem from './PollItem';

const PollsList = () => {
    const { t } = useTranslation();

   const polls = useSelector(state => state['features/polls'].polls);
   const conference = useSelector(state => state['features/base/conference'].conference);

   const socketPollEndMessage= useSelector((state: IReduxState) =>  state["features/base/cs-socket"].socketPollEndMessage);
   const socketPollStartMessage= useSelector((state: IReduxState) => state["features/base/cs-socket"].socketPollStartMessage);
  
//    Object.assign(polls, pollsAPI)
   
    const pollListEndRef = useRef(null);

    const [PollStartMessage, setPollStartMessage] = useState([]);


    useEffect(() => {
        
   if(socketPollStartMessage!=null)
   {

    setPollStartMessage(socketPollStartMessage)
    if(socketPollStartMessage!=null)
    {

        Object.assign(polls, [])
   let pollNo=0;
   
   let allPolls = socketPollStartMessage.map((pollAPI: { groupName:any; totalUsersAnswered:any; answerOptions: any[]; isAnswerTypeSingle: any; id: any; question: any; }) =>  
{
pollNo=pollNo++;

let ans=pollAPI.answerOptions.map((ans: { answerLabel: any; id: any; pollStatistics:any; pollPercentage:any; }) =>  
        {
           
            return({"name": ans.answerLabel+" : "+ans.answerOption,
           "id":ans.id,
           
            "voters": []})
        })
   
     
       let  lastVote=pollAPI.answerOptions.map((option: { isSelected: any; }) =>  
        {
           return option.isSelected;
        })
       

return(
{

    "changingVote": pollAPI.isAnswerTypeSingle,
    "senderId": pollAPI.id,
    "showResults": false,
    "lastVote": lastVote,
    "question": pollAPI.question,
    "answers": ans,
"quetionId":pollAPI.id,
'groupname':pollAPI.groupName,

}




)
})
document.getElementById("groupname").innerHTML =allPolls[0].groupname

Object.assign(polls, allPolls)
    }
   }


    },[socketPollStartMessage])

    useEffect(() => {
        
   
          

                if(socketPollEndMessage!=null)
                {
               let pollNo=0;
               
               let allPolls = socketPollEndMessage.map((pollAPI: { groupName:any; totalUsersAnswered:any; answerOptions: any[]; isAnswerTypeSingle: any; id: any; question: any; }) =>  
        {
            pollNo=pollNo++;
    
            let ans=pollAPI.answerOptions.map((ans: { answerLabel: any; id: any; pollStatistics:any; pollPercentage:any; }) =>  
                    {
                       
                        return({"name": ans.answerLabel+" : "+ans.answerOption,
                       "id":ans.id,
                       'pollStatistics':ans.pollStatistics,
            'pollPercentage':ans.pollPercentage,
                        "voters": []})
                    })
               
                 
                   let  lastVote=pollAPI.answerOptions.map((option: { isSelected: any; }) =>  
                    {
                       return option.isSelected;
                    })
                   
    
        return(
        {
            
                "changingVote": pollAPI.isAnswerTypeSingle,
                "senderId": pollAPI.id,
                "showResults": true,
                "lastVote": lastVote,
                "question": pollAPI.question,
                "answers": ans,
            "quetionId":pollAPI.id,
            'groupname':pollAPI.groupName,
            
        }
        
        
        
        
        )
   })
   document.getElementById("groupname").value =allPolls[0].groupName

   
   Object.assign(polls, allPolls)
                }


     
         },[socketPollEndMessage])

    
    const scrollToBottom = useCallback(() => {
        if (pollListEndRef.current) {
            // Safari does not support options
            const param = browser.isSafari()
                ? false : {
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                };

            pollListEndRef.current.scrollIntoView(param);
        }





    }, [ pollListEndRef.current ]);
    const listPolls = Object.keys(polls);

    useEffect(() => {

       


 //Object.assign(polls, pollsAPI)

                        


scrollToBottom();

    }, [ polls ]);


    return (
        <>
            {listPolls.length === 0
                ? <div className = 'pane-content'>
                    <Icon
                        className = 'empty-pane-icon'
                        src = { IconChatUnread } />
                    <span className = 'empty-pane-message'>{t('polls.results.empty')}</span>
                </div>
                : listPolls.map((id, index) => (


                    <PollItem
                        key = { id }
                        pollId = { id }
                        ref = { listPolls.length - 1 === index ? pollListEndRef : null } />
                ))}
        </>
    );
};

export default PollsList;
