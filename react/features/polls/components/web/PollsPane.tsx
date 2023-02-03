import Button from "../../../base/ui/components/web/Button";
// @ts-ignore
import AbstractPollsPane from "../AbstractPollsPane";
// @ts-ignore
import { Icon, IconTimerRed,IconChatUnread } from '../../../base/icons';
// @ts-ignore
import type { AbstractProps } from "../AbstractPollsPane";
import React, { useCallback, useEffect, useRef, useState } from "react";
// @ts-ignore
import PollItem from './PollItem';
// @ts-ignore
import { ApiConstants } from "../../../../../ApiConstants";
import { ApplicationConstants } from "../../../../../ApplicationConstants";
import { clearPollsall, setPollsall } from "../../actions";
import { IReduxState } from "../../../app/types";

// @ts-ignore
// import {
  
//     IconTimerRed,
  
// } from "../../../base/icons";
// @ts-ignore
import { useDispatch, useSelector } from "react-redux";
import { browser } from "../../../base/lib-jitsi-meet";
const PollsPane = (props: AbstractProps) => {
    const polls = useSelector(
        (state: IReduxState) => state["features/polls"].polls
    );
  
    const socketPollEndMessage= useSelector((state: IReduxState) =>  state["features/base/cs-socket"].socketPollEndMessage);
    const socketPollStartMessage= useSelector((state: IReduxState) => state["features/base/cs-socket"].socketPollStartMessage);
   
 //    Object.assign(polls, pollsAPI)
    
     const pollListEndRef = useRef(null);
 

 
 
     useEffect(() => {
         
    if(socketPollStartMessage!=null)
    {
     

     if(socketPollStartMessage!=null)
     {
 
         setApitoPoll(socketPollStartMessage)
    
     }
    }
 
 
     },[socketPollStartMessage])
 
     useEffect(() => {
         
    
    
 
                 if(socketPollEndMessage!=null)
                 {
                    
                    setApitoPoll(socketPollEndMessage)
                 }
 
 
      
          },[socketPollEndMessage])
 
     
 
     const listPolls = Object.keys(polls);


    // The state for our timer
    const [timer, setTimer] = useState("00:00:00"); // display the given time

    const [timerCount, setTimerCount] = useState("00:00:00"); // time start from zero
    const [seconds, setSeconds] = useState(0); // Count sec when its given time
    const [pollcounttime, setPollcounttime] = useState(0); // Count from start 0
    ;

    const [loadApi, setLoadApi] = useState(0);
    const [allPollsdata, setallPolls] = useState([]);
    const [groupname, setGroupname] = useState("");
    const [pollResult, setpollResult] = useState(true);
    const dispatch = useDispatch();
    const Ref = useRef(null);
    useEffect(() => {
       
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds - hours * 3600) / 60);
        let secondstime = seconds - hours * 3600 - minutes * 60;

        setTimerCount(
            (hours > 9 ? hours : "0" + hours) +
                ":" +
                (minutes > 9 ? minutes : "0" + minutes) +
                ":" +
                (secondstime > 9 ? secondstime : "0" + secondstime)
        );
       

        
    }, [seconds]);

    useEffect(() => {
        let interval = setInterval(() => {
            setSeconds((seconds) => seconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getTimeRemaining = (e: any) => {
        
        const total = Date.parse(e) - Date.parse(new Date().toString());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const startTimer = (e: any) => {
        let { total, hours, minutes, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                    ":" +
                    (minutes > 9 ? minutes : "0" + minutes) +
                    ":" +
                    (seconds > 9 ? seconds : "0" + seconds)
            );
        }
        if (total == 0) {
            setPollcounttime(0);
            setTimer("00:00:00");
        }
    };

    const clearTimer = (e: any) => {
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next
        setTimer("00:00:00");

        // If you try to remove this line the
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        let refs = Ref.current as any;
        refs = id;
    };

    const getDeadTime = () => {
        let deadline = new Date();

        // This is where you need to adjust if
        // you entend to add more time
deadline.setSeconds(
                  deadline.getSeconds() + parseInt(pollcounttime.toString())
              )
            

        return deadline;
    };
    useEffect(() => {
      clearTimer(getDeadTime()) 
    }, [pollcounttime]);

    useEffect(() => {
       
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
            
                setApitoPoll(selected)
            });
        });
    }, []);


    const setApitoPoll = (selected:any) => {
        dispatch(clearPollsall());
       
    setGroupname(selected.data[0].groupName);
          
                let pollNo = 0;

                let allPolls = selected.data.map(
                    (pollAPI: {
                        groupName: any;
                        totalUsersAnswered: any;
                        answerOptions: any[];
                        isAnswerTypeSingle: any;
                        id: any;
                        question: any;
                    }) => {
                        pollNo = pollNo++;

                        let ans = pollAPI.answerOptions.map(
                            (ans: {
                                answerLabel: any;
                                answerOption: any;
                                id: any;
                                pollStatistics: any;
                                pollPercentage: any;
                            }) => {
                                return {
                                    name:
                                        ans.answerLabel +
                                        " : " +
                                        ans.answerOption,
                                    id: ans.id,
                                    pollStatistics: ans.pollStatistics,
                                    pollPercentage: ans.pollPercentage,
                                    voters: [],
                                };
                            }
                        );

                        let seleted = false;
                        let lastVote = pollAPI.answerOptions.map(
                            (option: { isSelected: any }) => {
                                if (option.isSelected == "true") {
                                    seleted = true;
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        );
                        //  "lastVote": lastVote,

                        return {
                            changingVote: pollAPI.isAnswerTypeSingle,
                            senderId: pollAPI.id,
                            showResults:
                                selected.pollGroup.status == "Ended" ? true : false,
                            seleted: seleted,
                            duration: selected.pollGroup.duration,
                            lastVote: lastVote,
                            question: pollAPI.question,
                            answers: ans,
                            quetionId: pollAPI.id,
                            groupname: pollAPI.groupName,
                            startDateTime:selected.pollGroup.startDateTime
                        };
                    }
                );
                const groupname = document.getElementById("groupname");

                if (groupname != null && groupname != undefined) {
                    groupname.innerHTML = allPolls[0].groupname;
                }


                if (!allPolls[0].showResults) {
                    setpollResult(false)


                    let newDate = new Date();
                    let oldDate = new Date(allPolls[0].startDateTime);





                    newDate.setTime(+newDate - +oldDate);


                    let durations= Number(
                        (+new Date(newDate.getTime()) / 1000)
                            .toString()
                            .split(".")[0]
                    )

                  
                   setPollcounttime(parseInt(allPolls[0].duration)-durations); 






                    setSeconds(
                        Number(
                            (+new Date(newDate.getTime()) / 1000)
                                .toString()
                                .split(".")[0]
                        )
                    );
                }else{
                    setpollResult(true)
                    setTimer("00:00:00");
                    setTimerCount("00:00:00");
                }
                setallPolls(allPolls);
               // Object.assign(polls, allPolls);
               dispatch(setPollsall(allPolls));
                
                setLoadApi(1);
            }


    useEffect(() => {
     
        Object.assign(polls, allPollsdata);
    }, [loadApi]);

    return (
        <div className="polls-pane-content">
            <div
                style={{
                    fontWeight: "bold",
                    marginTop: 5,
                    fontSize: 18,
                    textTransform: "uppercase",
                    padding: 3,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        padding: 15,
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            height: 25,
                            width: "100%",
                            whiteSpace: "nowrap",
                            fontSize: 18,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                        title={groupname}
                        id="groupname"
                    >
                        {groupname}
                    </div>
                    {!pollResult ?   <div
                        style={{
                            fontSize: 18,
                            display: "flex",
                            fontWeight: "500",
                            color: "#ed5757",
                            width: "50%",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Icon color="#ed5757" size={22} src={IconTimerRed} />
                         <div
                            style={{
                                marginLeft: 10,
                            }}
                        >
                            {" "}
                            {pollcounttime != 0 ? timer : timerCount}
                        </div>
                    </div>:<div style={{fontSize:16,display: "flex",
                            fontWeight: "500",
                            color: "#ed5757",
                            width: "50%",
                            justifyContent: "flex-end",}}>Poll Ended</div>}
                </div>
            </div>
            <div className={"poll-container"}>
                {loadApi == 1 ? 
                
                <>
                {listPolls.length === 0
                    ? <div className = 'pane-content'>
                        <Icon
                            className = 'empty-pane-icon'
                            src = { IconChatUnread } />
                        <span className = 'empty-pane-message'></span>
                    </div>
                    : listPolls.map((id, index) => (
    
    
                        <PollItem
                            key = { id }
                            pollId = { id }
                            ref = { listPolls.length - 1 === index ? pollListEndRef : null } />
                    ))}
            </>
                : null}
            </div>
        </div>
    );

    
};


export default AbstractPollsPane(PollsPane);
