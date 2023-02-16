import { Theme } from "@mui/material";

import { makeStyles } from "tss-react/mui";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Button from "../../../base/ui/components/web/Button";
import Checkbox from "../../../base/ui/components/web/Checkbox";
import { BUTTON_TYPES } from "../../../base/ui/constants";
import { isSubmitAnswerDisabled } from "../../functions";
import AbstractPollAnswer, { AbstractProps } from "../AbstractPollAnswer";
import { useSelector } from "react-redux";

import { IReduxState } from "../../../app/types";
const useStyles = makeStyles()((theme: Theme) => {
    return {
        buttonMargin: {
            marginRight: theme.spacing(2),
        },
    };
});

const PollAnswer = ({
    creatorName,
    checkBoxStates,
    poll,
    setCheckbox,
    skipAnswer,
    skipChangeVote,
    submitAnswer,
    t,
}: AbstractProps) => {
    const { changingVote } = poll;
    const { classes: styles } = useStyles();

    const [userName, userType] = creatorName?.split("|");
    const [loadApi, setLoadApi] = useState(0);

    const polls = useSelector(
        (state: IReduxState) => state["features/polls"].polls
    );
    //  poll.lastVote[index]==true?false:poll.seleted     disabled={poll.seleted}
//console.log(poll)
    return (
        <div className="poll-answer">
            <div className="poll-header">
                <div className="poll-question">
                    <span>{poll.question}</span>
                </div>
                {/* <div className = 'poll-creator'>
                    { t('polls.by', poll.senderId ) }
                </div> */}
            </div>
            <ol className="poll-answer-list">
                {poll.answers.map((answer: any, index: number) => (
                    <li
                        onClick={(ev) => setCheckbox(index, checkBoxStates[index],poll.changingVote,poll.lastVote[index])}
                        className="poll-answer-container"
                        key={index}
                    >
                        <div  className="pollActiveArea">
                            <input
                            id = { answer.id }
                             key = { answer.id }
                             name= { poll.quetionId }
                                className={
                                    poll.changingVote
                                        ? "pollRadio"
                                        : "pollcheckbox"
                                }
                                type={
                                    poll.changingVote
                                        ? "Radio"
                                        : "checkbox"
                                }
                                disabled={poll.lastVote[index]==true?false:poll.seleted }
                                style={{margin:0,}}
                                checked = { checkBoxStates[index] }
                            />
                            <div
                               id = {"check"+answer.id }
                                style={{
                                    opacity:poll.seleted ? poll.lastVote[index]?1:0: checkBoxStates[index] ? 1 : 0,
                                }}
                               
                                className={
                                    poll.changingVote
                                        ? "jitsi-icon pollActiveAreaRadio"
                                        : "jitsi-icon pollActiveAreacheckmark"
                                }
                            >
                            
                            </div>
                            <div
                               id = {"checkDisplay"+answer.id }
                                style={{
                                   display:'none',
                                   opacity:1
                                }}
                                className={
                                    poll.changingVote
                                        ? "jitsi-icon pollActiveAreaRadio"
                                        : "jitsi-icon pollActiveAreacheckmark"
                                }
                            >
                                <svg
                                    fill="none"
                                    height="18"
                                    width="18"
                                    viewBox="0 0 18 18"
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                { poll.changingVote          ?                                    
                                
                                <circle cx="11" cy="9" r="5" fill="#246FE5"></circle>:
                                    <path
                                        d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z"
                                        fill="white"
                                        stroke="white"
                                    ></path>
                                    
                                    
                                    }
                                </svg>
                            </div>


                        </div>
<label style={{color:'#fff'}}>{answer.name}</label>
                        {/* {
                           poll.changingVote? <Checkbox
                                checked = { checkBoxStates[index] }
                                key = { answer.id }
                                id = { answer.id }
                                label = { answer.name }
                                name= { poll.quetionId }
                                type = 'radio' 
                                disabled={poll.lastVote[index]==true?false:poll.seleted  }
                               
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange = { ev => setCheckbox(index, ev.target.checked) } />:<Checkbox
                                checked = { checkBoxStates[index] }
                                key = { answer.id }
                                id = { answer.id }
                                type = 'checkbox' 
                                name= { poll.quetionId }
                                label = { answer.name }
                                disabled={poll.seleted  }
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange = { ev => setCheckbox(index, ev.target.checked) } />
} */}
                    </li>
                ))}
            </ol>
            <div
                id={"pollids" + poll.senderId}
                className="poll-footer poll-answer-footer"
            >
                {/* <Button
                    accessibilityLabel = { t('polls.answer.skip') }
                    className = { styles.buttonMargin }
                    fullWidth = { true }
                    labelKey = { 'polls.answer.skip' }
                    onClick = { changingVote ? skipChangeVote : skipAnswer }
                    type = { BUTTON_TYPES.SECONDARY } /> */}
                {!poll.seleted ? (
                    <Button
                        accessibilityLabel={t("polls.answer.submit")}
                        disabled={isSubmitAnswerDisabled(checkBoxStates)}
                        fullWidth={true}
                        labelKey={"polls.answer.submit"}
                        onClick={submitAnswer}
                    />
                ) : null}
            </div>
        </div>
    );
};

/*
 * We apply AbstractPollAnswer to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
export default AbstractPollAnswer(PollAnswer);
