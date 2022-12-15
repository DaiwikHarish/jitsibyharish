import React, { ComponentType, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { createPollEvent } from '../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../analytics/functions';
import { IReduxState } from '../../app/types';
import { getParticipantDisplayName } from '../../base/participants/functions';
import { useBoundSelector } from '../../base/util/hooks';
import { registerVote, setVoteChanging } from '../actions';
import { COMMAND_ANSWER_POLL } from '../constants';
import { IPoll } from '../types';

/**
 * The type of the React {@code Component} props of inheriting component.
 */
type InputProps = {
    pollId: string;
};

/*
 * Props that will be passed by the AbstractPollAnswer to its
 * concrete implementations (web/native).
 **/
export type AbstractProps = {
    checkBoxStates: boolean[];
    creatorName: string;
    poll: IPoll;
    setCheckbox: Function;
    skipAnswer: () => void;
    skipChangeVote: () => void;
    submitAnswer: () => void;
    t: Function;
};

/**
 * Higher Order Component taking in a concrete PollAnswer component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.AbstractComponent} Component - The concrete component.
 * @returns {React.AbstractComponent}
 */
 const AbstractPollAnswer = (Component: ComponentType<AbstractProps>) => (props: InputProps) => {
    const { pollId } = props;

    const conference: any = useSelector((state: IReduxState) => state['features/base/conference'].conference);

    const poll: IPoll = useSelector((state: IReduxState) => state['features/polls'].polls[pollId]);

    const [ checkBoxStates, setCheckBoxState ] = useState(() => {
        if (poll.lastVote !== null) {
            return [ ...poll.lastVote ];
        }

        return new Array(poll.answers.length).fill(false);
    });

    const participantName = useBoundSelector(getParticipantDisplayName, poll.senderId);

    const setCheckbox = useCallback((index, state) => {
        const newCheckBoxStates = [ ...checkBoxStates ];

        newCheckBoxStates[index] = state;
        setCheckBoxState(newCheckBoxStates);
        sendAnalytics(createPollEvent('vote.checked'));
    }, [ checkBoxStates ]);

    const dispatch = useDispatch();

    const submitAnswer = useCallback(() => {
       
            const pollidsdiv = document.getElementById("toggleFilter") as HTMLInputElement
            pollidsdiv.style.display = "none";
        


const queryString = window.location.search;
     

        const urlParams = new URLSearchParams(queryString);

        const meetingId = urlParams.get('meetingId')
        const userId = urlParams.get('userId')

        let ansCount=0;
   
let convertAns=checkBoxStates.map((selected)=>
    {
     
        if(selected==true)
        { 
            return        poll.answers[ansCount].id;
            
        }
        ansCount++;
    }
)

var convertAns_filter = convertAns.filter(function (el) {
    return el != null;
  });

let url = 'https://dev.awesomereviewstream.com/svr/api/poll'

const putMethod = {
    method: 'PUT', // Method itself
    headers: {
     'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
    },
    body: JSON.stringify({
        "meetingId": meetingId,
        "userId": userId,
        "pollQuestionId": poll.senderId,
        "pollAnswerOptionIds": convertAns_filter,
       
    })
   }
   
   // make the HTTP put request using fetch api
   fetch(url, putMethod)
   .then(response => response.json())
   .then(data => {
    
    console.log(data)
   // pollids74
console.log("sent poll")

const pollidsdiv = document.getElementById("toggleFilter") as HTMLInputElement
pollidsdiv.style.display = "none";
}) // Manipulate the data retrieved back, if we want to do something with it
   .catch(err => console.log(err)) // Do something with the error


        // conference.sendMessage({
        //     type: COMMAND_ANSWER_POLL,
        //     pollId:poll.senderId,
        //     answers: checkBoxStates
        // });

        // sendAnalytics(createPollEvent('vote.sent'));
        // dispatch(registerVote(pollId, checkBoxStates));

        //return false;
    }, [ pollId, checkBoxStates, conference ]);

    const skipAnswer = useCallback(() => {
        dispatch(registerVote(pollId, null));
        sendAnalytics(createPollEvent('vote.skipped'));

    }, [ pollId ]);

    const skipChangeVote = useCallback(() => {
        dispatch(setVoteChanging(pollId, false));
    }, [ dispatch, pollId ]);

    const { t } = useTranslation();

    return (<Component
        checkBoxStates = { checkBoxStates }
        creatorName = { participantName }
        poll = { poll }
        setCheckbox = { setCheckbox }
        skipAnswer = { skipAnswer }
        skipChangeVote = { skipChangeVote }
        submitAnswer = { submitAnswer }
        t = { t } />);

};

export default AbstractPollAnswer;
