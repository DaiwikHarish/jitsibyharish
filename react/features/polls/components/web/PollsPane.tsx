

import Button from '../../../base/ui/components/web/Button';
// @ts-ignore
import AbstractPollsPane from '../AbstractPollsPane';
// @ts-ignore
import type { AbstractProps } from '../AbstractPollsPane';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PollCreate from './PollCreate';
// @ts-ignore
import PollsList from './PollsList';
import { useSelector } from 'react-redux';

import { IReduxState } from '../../../app/types';
const PollsPane = (props: AbstractProps) => {
   // const polls = useSelector(state => state['features/polls'].polls);
    const polls= useSelector((state: IReduxState) => state['features/polls'].polls);
    const { createMode, onCreate, setCreateMode, t } = props;
    const [loadApi, setLoadApi] = useState(0);


    useEffect(() => {


        let url = 'https://dev.awesomereviewstream.com/svr/api/poll?groupId=21';
        
        fetch(
            url
        )
            .then((response) => response.json())
            .then((data) => {
               let pollNo=0;
               
               let allPolls = data.data.map((pollAPI: { answerOptions: any[]; isAnswerTypeSingle: any; id: any; question: any; }) =>  
        {
            pollNo=pollNo++;
    
            let ans=pollAPI.answerOptions.map((ans: { answerLabel: any; id: any; }) =>  
                    {
                       
                       return({"name": ans.answerLabel,
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
            "quetionId":pollAPI.id

        
        }
        
        
        
        
        )
   })


   Object.assign(polls, allPolls)

   setLoadApi(1)             
  
  })
  })


//    // let polls = useSelector(state => state['features/polls'].polls);
//     console.log(allPolls)
//     Object.assign(polls, allPolls)
    
//     })




// let pollsAPI={
//     "1": {
//         "changingVote": false,
//         "senderId": "a155c9f5",
//         "showResults": false,
//         "lastVote": null,
//         "question": "question",
//         "answers": [
//             {
//                 "name": "answers Optn AP1",
//                 "voters": []
//             },
//             {
//                 "name": "answers Optn AP1",
//                 "voters": []
//             }
//         ]
//     },
//     "2": {
//         "changingVote": false,
//         "senderId": "a155c9f5",
//         "showResults": false,
//         "lastVote": null,
//         "question": "question",
//         "answers": [
//             {
//                 "name": " Optn AP1 1",
//                 "voters": []
//             },
//             {
//                 "name": " Optn AP1 2",
//                 "voters": []
//             }
//         ]
//     },
//     "3":  {
//         "changingVote": false,
//         "senderId": "1e7aa8e0",
//         "showResults": true,
//         "lastVote": [
//             false,
//             true,
//             false
//         ],
//         "question": "tesApi Questions",
//         "answers": [
//             {
//                 "name": "Optn1",
//                 "voters": []
//             },
//             {
//                 "name": "Optn2",
//                 "voters": []
//             },
//             {
//                 "name": "Optn3",
//                 "voters": []
//             }
//         ]
//     }
// }


    
    return loadApi==1?
    <div className = 'polls-pane-content'>
            <div className = { 'poll-container' } >
                <PollsList />
            </div>
         
        </div>:
    

    //  createMode
    //     ? <PollCreate setCreateMode = { setCreateMode } />
    //     : 
    <div className = 'polls-pane-content'>
            <div className = { 'poll-container' } >
                <PollsList />
            </div>
            {/* <div className = 'poll-footer poll-create-footer'>
                <Button
                    accessibilityLabel = { t('polls.create.create') }
                    autoFocus = { true }
                    fullWidth = { true }
                    labelKey = { 'polls.create.create' }
                    onClick = { onCreate } />
            </div> */}
        </div>;



}

/*
 * We apply AbstractPollsPane to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
export default AbstractPollsPane(PollsPane);
