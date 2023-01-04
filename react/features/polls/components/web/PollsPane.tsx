

import Button from '../../../base/ui/components/web/Button';
// @ts-ignore
import AbstractPollsPane from '../AbstractPollsPane';
// @ts-ignore
import type { AbstractProps } from '../AbstractPollsPane';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PollCreate from './PollCreate';
// @ts-ignore
import PollsList from './PollsList';
import { ApiConstants } from '../../../../../ApiConstants';
import { ApplicationConstants } from '../../../../../ApplicationConstants';
import {clearPolls, receivePoll } from '../../actions';
import { IReduxState } from '../../../app/types';

import { useDispatch, useSelector } from 'react-redux';
const PollsPane = (props: AbstractProps) => {
   // const polls = useSelector(state => state['features/polls'].polls);
    const polls= useSelector((state: IReduxState) => state['features/polls'].polls);
   
     
    const { createMode, onCreate, setCreateMode, t } = props;
    const [loadApi, setLoadApi] = useState(0);
    const [allPollsdata, setallPolls] = useState([]);
    const [groupname, setGroupname] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearPolls());
      
        
        fetch(
            ApiConstants.latestPoll
        )
            .then((response) => response.json())
            .then((data) => {


                setGroupname(data.data[0].groupName)
             
                
       
   
  

                fetch(
                 ApiConstants.poll+"?groupId="+data.data[0].groupId+"&includeStatistic=true&userId="+ApplicationConstants.userId)
                    .then((response) => response.json())
                    .then((selected) => {
                       
                        let pollNo=0;
               
                        let allPolls = selected.data.map((pollAPI: { groupName:any; totalUsersAnswered:any; answerOptions: any[]; isAnswerTypeSingle: any; id: any; question: any; }) =>  
                 {
         
                  
         
                     
                     
                     pollNo=pollNo++;
             
                     let ans=pollAPI.answerOptions.map((ans: { answerLabel: any; answerOption:any; id: any; pollStatistics:any; pollPercentage:any; }) =>  
                             {
                    
                                 return({"name": ans.answerLabel+" : "+ans.answerOption,
                                "id":ans.id,
                                'pollStatistics':ans.pollStatistics,
                     'pollPercentage':ans.pollPercentage,
                                 "voters": []})
                             })
                        
                          let seleted=false;
                             let  lastVote=pollAPI.answerOptions.map((option: { isSelected: any; }) =>  
                             {
                                if(option.isSelected=="true")
                                {
                                    seleted=true
                                    return true;
                                }else{
                                    return false;
                                }
                            

                             })
                           //  "lastVote": lastVote,
             
                 return(
                 {
                     
                         "changingVote": pollAPI.isAnswerTypeSingle,
                         "senderId": pollAPI.id,
                         "showResults": data.status=='Ended'?true:false,
                         "seleted":seleted,
                        "lastVote":lastVote,
                         "question": pollAPI.question,
                         "answers": ans,
                     "quetionId":pollAPI.id,
                     'groupname':pollAPI.groupName,
                     
                 }
                 
                 
                 
                 
                 )
         
             
         
            })


setallPolls(allPolls)
Object.assign(polls, allPolls)
console.log(allPolls)
setLoadApi(1)


// allPollsSel.map((allPolls)=>{

// dispatch(receivePoll(allPolls.id, allPolls, false));


// })


  })
      

})
  },[])

  useEffect(() => {

    Object.assign(polls, allPollsdata)
  },[loadApi])

    
    return(
    <div className = 'polls-pane-content'>
    <div style={{textAlign:'center', fontWeight:'bold', fontSize:18, textTransform:'uppercase', padding:3,}}>
<span id='groupname'>{groupname}</span>
</div>
  <div className = { 'poll-container' } >
      <PollsList />
  </div>

</div>
)

    //  createMode
    //     ? <PollCreate setCreateMode = { setCreateMode } />
    //     : 
//     <div className = 'polls-pane-content'>
//               <div style={{textAlign:'center', fontWeight:'bold', fontSize:18, textTransform:'uppercase', padding:3,}}>
//     <span id='groupname'>{groupname}</span>
//    </div>
//             <div className = { 'poll-container' } >
//                 <PollsList />
//             </div>
//             <div className = 'poll-footer poll-create-footer'>
//                 <Button
//                     accessibilityLabel = { t('polls.create.create') }
//                     autoFocus = { true }
//                     fullWidth = { true }
//                     labelKey = { 'polls.create.create' }
//                     onClick = { onCreate } />
//             </div>
//         </div>;



}

/*
 * We apply AbstractPollsPane to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
export default AbstractPollsPane(PollsPane);
