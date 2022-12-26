

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
             
                
               let pollNo=0;
               
               let allPolls = data.data.map((pollAPI: { groupName:any; totalUsersAnswered:any; answerOptions: any[]; isAnswerTypeSingle: any; id: any; question: any; }) =>  
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
               
                 
                   let  lastVote=pollAPI.answerOptions.map((option: { isSelected: any; }) =>  
                    {
                      // return option.isSelected;
                      return false;
                    })
                  //  "lastVote": lastVote,
    
        return(
        {
            
                "changingVote": pollAPI.isAnswerTypeSingle,
                "senderId": pollAPI.id,
                "showResults": data.status=='Ended'?true:false,
                "seleted":false,
               "lastVote":lastVote,
                "question": pollAPI.question,
                "answers": ans,
            "quetionId":pollAPI.id,
            'groupname':pollAPI.groupName,
            
        }
        
        
        
        
        )

    

   })
   
  
        
                fetch(
                 ApiConstants.pollbyUser
                )
                    .then((response) => response.json())
                    .then((selected) => {
                       
                    let allPollsSel=allPolls.map((allPolls: {lastVote:any, changingVote:any; senderId:any; showResults: any; answers: any; groupname: any;quetionId: any; question: any;id: any; }) =>  
                           {     let check=false;
                        selected.data.map((sel:{id:any})=>{
                       
                            if(allPolls.quetionId==sel.id)
                            {
                                check=true;
                            }
                        })


                        if(check)
                        {
                            return(
                                {
                                    
                                        "changingVote": allPolls.changingVote,
                                        "senderId": allPolls.senderId,
                                        "showResults": allPolls.showResults,
                                        "seleted":true,
                                        "lastVote":allPolls.lastVote,
                                        "question": allPolls.question,
                                        "answers": allPolls.answers,
                                    "quetionId":allPolls.quetionId,
                                    'groupname':allPolls.groupname,
                                    
                                })
                        }else{

                            return(
                                {
                                    
                                    "changingVote": allPolls.changingVote,
                                    "senderId": allPolls.senderId,
                                    "showResults": allPolls.showResults,
                                    "seleted":false,
                                    "lastVote":allPolls.lastVote,
                                    "question": allPolls.question,
                                    "answers": allPolls.answers,
                                "quetionId":allPolls.quetionId,
                                'groupname':allPolls.groupname,
                                })
                        }

                    })


setallPolls(allPollsSel)
Object.assign(polls, allPollsSel)
console.log(allPollsSel)
setLoadApi(1)


// allPollsSel.map((allPolls)=>{

// dispatch(receivePoll(allPolls.id, allPolls, false));


// })


  })  })
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
