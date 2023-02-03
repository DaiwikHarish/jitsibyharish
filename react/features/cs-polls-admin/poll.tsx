import React, { useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";
// @ts-ignore
import CreatePoll from "./createPoll";

// @ts-ignore
import EditPoll from "./editPoll";
import Button from "../base/ui/components/web/Button";
import Input from "../base/ui/components/web/Input";
import { ApiConstants } from "../../../ApiConstants";
import { ApplicationConstants } from "../../../ApplicationConstants";
import { RingLoader } from "react-spinners";
// @ts-ignore
import { IconTimer, IconTimerRed, IconWarning, Icon } from "../base/icons";

interface IpollProps {
    showAddmessage?: Boolean;
}

const poll = ({ showAddmessage }: IpollProps) => {
    // const poll = ()=> {
    const [pollOptions, setPollOptions] = useState([]); // Data display in dropdown select box
    const [error, seterror] = useState(false);
    const [errormsg, setErrormsg] = useState(false);
    const [pollAns, setpollAns] = useState([]); // set the ans in the poll data
    const [pollResult, setpollResult] = useState<boolean | null>(null); // show or hide result

    const [pollSeletedId, setPollSeletedId] = useState(0); // Seleted id from dropdown menu

    const [apibyseconds, setapibyseconds] = useState(0); // Every 3 seconds poll api calls
    const [pollcounttime, setPollcounttime] = useState(0); // Count from start 0
    const [polllauched, setPolllauched] = useState(false); // Enable state of poll is launched or not
    const [isDisabledSelect, setisDisabledSelect] = useState(false); //  state of disable the dropdown menu
    const [seconds, setSeconds] = useState(0); // Count sec when its given time
    const [pollRelaunch, setpollRelaunch] = useState<boolean | null>(null); //state of relaunched button
    const [apicall, setapicall] = useState(false); // call when to call api
    const [loading, setLoading] = useState(false);
    const [endautopoll, setEndautopoll] = useState(false);
    const [createPollState, setcreatePollState] = useState(false);
    const [editPollState, seteditPollState] = useState(false);
    const [deletePollState, setdeletePollState] = useState(false);
    const [PollSeleted, setPollSeleted] = useState(false);

    const [showDeletemessage, setshowDeletemessage] = useState(false);
    const [showAddmessagein, setshowAddmessagein] = useState(showAddmessage);
    const Ref = useRef(null);

    // The state for our timer
    const [timer, setTimer] = useState("00:00:00"); // display the given time

    const [timerCount, setTimerCount] = useState("00:00:00"); // time start from zero

    useEffect(() => {
        // if(seconds>=60)
        // {

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
        //  setTimerCount(hours+':'+minutes+':'+secondstime)

        // }
    }, [seconds]);

    useEffect(() => {
        if (apicall) {
            if (apibyseconds >= 3) {
                fetch(
                    ApiConstants.poll +
                        "?groupId=" +
                        pollSeletedId +
                        "&includeStatistic=true"
                )
                    .then((response) => response.json())
                    .then((selected) => {
                        if (selected.type == "Error") {
                            alert(selected.message);
                        } else {
                            setPoll(selected, true, false);
                        }
                    });

                setapibyseconds(0);
            }
        }
    }, [apibyseconds]);

    useEffect(() => {
        let interval = window.setInterval(() => {
            setapibyseconds((apibyseconds) => apibyseconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval = setInterval(() => {
            setSeconds((seconds) => seconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getTimeRemaining = (e: any) => {
        let todaydate = new Date();
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
        if (total == 0 && polllauched) {
            setPollcounttime(0);
            setTimer("00:00:00");

            setPolllauched(false);

            endedautoPoll();
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

        polllauched
            ? deadline.setSeconds(
                  deadline.getSeconds() + parseInt(pollcounttime.toString())
              )
            : null;

        return deadline;
    };

    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible

    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
        polllauched ? clearTimer(getDeadTime()) : null;
    }, [polllauched]);

    // Another way to call the clearTimer() to start
    // the countdown is via action event from the
    // button first we create function to be called
    // by the button
    const onClickReset = () => {
        clearTimer(getDeadTime());
    };

    const onChange = (newValue: any) => {
        // console.log(newValue)
        setPollSeletedId(newValue.id); // globaly setting poll id
        setPollSeleted(newValue.label);
        setPollcounttime(0);
        setSeconds(0);
        setshowDeletemessage(false);
        setshowAddmessagein(false);

        getSeletecdpoll(newValue.id);
        setapicall(false);
    };
    function getPoll() {
        setapicall(false);
        setisDisabledSelect(false);
        fetch(ApiConstants.pollGroupbyMeeting)
            .then((response) => response.json())
            .then((pollData) => {
                if (pollData.type == "Error") {
                    alert(pollData.message);
                    setLoading(false);
                } else {
                    let allPolls = pollData.data.map(
                        (polls: any, index: any) => {
                            return {
                                value: index,
                                label: polls.name,
                                questionCount: polls.questionCount,
                                id: polls.id,
                            };
                        }
                    );

                    setPollOptions(allPolls);
                }
            });
    }
    function deletePoll() {
        const GroupMethod = {
            method: "DELETE", // Method itself
            headers: {
                "Content-type": "application/json; charset=UTF-8", // Indicates the content
            },
        };

        fetch(
            ApiConstants.pollGroup + "?id=" + pollSeletedId + "&force=true",
            GroupMethod
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.type == "Error") {
                    seterror(true)
                    setErrormsg(data.message);
                    setLoading(false);
                } else {
                    getPoll();
                    setdeletePollState(false);
                    setshowDeletemessage(true);
                }
            });
    }
    function getSeletecdpoll(id: any) {
        setLoading(true);
        fetch(ApiConstants.pollGroup + "?id=" + id)
            .then((response) => response.json())
            .then((data) => {
                fetch(
                    ApiConstants.poll +
                        "?groupId=" +
                        id +
                        "&includeStatistic=true"
                )
                    .then((response) => response.json())
                    .then((selected) => {
                        if (selected.type == "Error") {
                            seterror(true)
                            setErrormsg(selected.message);
                            setLoading(false);
                        } else {
                            let startDateTime =
                                data.data[0].startDateTime != null &&
                                data.data[0].startDateTime != undefined &&
                                data.data[0].startDateTime != ""
                                    ? true
                                    : false;
                            let status =
                                data.data[0].status == "Launched"
                                    ? true
                                    : false;
                            setpollRelaunch(startDateTime);
                            setpollResult(status);
                            if (status) {
                                let newDate = new Date();
                                let oldDate = new Date(
                                    data.data[0].startDateTime
                                );
                                newDate.setTime(+newDate - +oldDate);

                                // 2023-01-10T12:39:01.281Z
                                //   startDateTime: "2023-01-09T03:15:40.000Z"

                                setapicall(true);
                                setisDisabledSelect(true);

                                setSeconds(
                                    Number(
                                        (+new Date(newDate.getTime()) / 1000)
                                            .toString()
                                            .split(".")[0]
                                    )
                                );
                            } else {
                                setapicall(false);
                                setisDisabledSelect(false);
                            }

                            setLoading(false);
                            setPoll(selected, startDateTime, status);
                        }
                    });
            });
    }

    function setPoll(selected: any, startDateTime: any, status: any) {
        let pollNo = 0;

        let allPolls = selected.data.map((pollAPI: any) => {
            pollNo = pollNo++;

            let ans = pollAPI.answerOptions.map((ans: any) => {
                return {
                    name: ans.answerLabel + " : " + ans.answerOption,
                    id: ans.id,
                    pollStatistics: ans.pollStatistics,
                    pollPercentage: ans.pollPercentage,
                    voters: [],
                };
            });

            let seleted = false;
            let lastVote = pollAPI.answerOptions.map((option: any) => {
                if (option.isSelected == "true") {
                    seleted = true;
                    return true;
                } else {
                    return false;
                }
            });

            return {
                changingVote: pollAPI.isAnswerTypeSingle,
                senderId: pollAPI.id,
                showResults: startDateTime, //change here Launched /Ended
                seleted: seleted,
                showwithResults: status, //change here Launched / Ended
                totalUsersAnswered: pollAPI.totalUsersAnswered,
                usersAnsweredPercentage: pollAPI.usersAnsweredPercentage,
                lastVote: lastVote,
                question: pollAPI.question,
                answers: ans,
                quetionId: pollAPI.id,
                groupname: pollAPI.groupName,
            };
        });
        setpollAns([]);

        let ansDiv = allPolls.map((item: any) =>
            !item.showResults ? (
                <div className="poll-answer" style={{ margin: "36px 1px" }}>
                    <div className="poll-header">
                        <div className="poll-question" style={{ fontSize: 18 }}>
                            <span>{item.question}</span>
                        </div>
                    </div>
                    <ol className="poll-answer-list">
                        {item.answers.map((ans: any) => (
                            <li className="poll-answer-container">
                                <div className="pollFormControl">
                                    <label className="pollActiveArea">
                                        <input
                                            className={
                                                item.changingVote
                                                    ? "pollRadio"
                                                    : "pollcheckbox"
                                            }
                                            type="checkbox"
                                        />
                                        <div className="jitsi-icon pollActiveAreacheckmark">
                                            <svg
                                                fill="none"
                                                height="18"
                                                width="18"
                                                viewBox="0 0 18 18"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z"
                                                    fill="currentColor"
                                                    stroke="currentColor"
                                                ></path>
                                            </svg>
                                        </div>
                                    </label>
                                    <label>{ans.name}</label>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="poll-footer poll-answer-footer"></div>
                </div>
            ) : (
                <div>
                    <div className="poll-results">
                        <div className="poll-header">
                            <div
                                className="poll-question"
                                style={{ fontSize: 18 }}
                            >
                                <strong>{item.question}</strong>
                            </div>
                        </div>
                        <div style={{ paddingBottom: 10, color: "#246fe5" }}>
                            {item.totalUsersAnswered} (
                            {parseInt(item.usersAnsweredPercentage)}%) answered
                        </div>
                        <ol className="poll-result-list">
                            {item.answers.map((ans: any) => (
                                <li>
                                    <div className="poll-answer-header">
                                        <span className="poll-answer-vote-name">
                                            {ans.name}
                                        </span>
                                    </div>
                                    <div className="poll-answer-short-results">
                                        <span className="poll-bar-container">
                                            <div
                                                className="poll-bar"
                                                style={{
                                                    width:
                                                        ans.pollPercentage +
                                                        "%",
                                                }}
                                            ></div>
                                        </span>
                                        <div className="poll-answer-vote-count-container">
                                            <span className="poll-answer-vote-count">
                                                {" "}
                                                {ans.pollStatistics}{" "}
                                                {parseInt(ans.pollPercentage) +
                                                    "%"}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            )
        );

        setpollAns(ansDiv);
    }
    useEffect(() => {
        getPoll();
    }, []);
    const launchPoll = () => {
        //  alert(pollcounttime)
        setLoading(true);
        let currentdate = new Date();

        currentdate.toISOString();
        setSeconds(0);
        setisDisabledSelect(true);
        pollcounttime > 0 ? setPolllauched(true) : null;

        const PATCHMethod = {
            method: "PATCH", // Method itself
            headers: {
                "Content-type": "application/json; charset=UTF-8", // Indicates the content
            },
            body: JSON.stringify({
                endDateTime: null,
                id: pollSeletedId,
                isLaunched: true,
                meetingId: ApplicationConstants.meetingId,
                startDateTime: currentdate,
                status: "Launched",
                duration: pollcounttime,
                updatedUserId: ApplicationConstants.userId,
            }),
        };

        // make the HTTP put request using fetch api

        fetch(ApiConstants.pollGroup + "/id=" + pollSeletedId, PATCHMethod)
            .then((response) => response.json())
            .then((data) => {
                if (data.type == "Error") {
                    seterror(true)
                    setErrormsg(data.message);
                    setLoading(false);
                } else {
                    getSeletecdpoll(pollSeletedId);
                    setapicall(true);
                }
            });
    };
    const relaunchPoll = () => {
        setLoading(true);
        const DELETEMethod = {
            method: "DELETE", // Method itself
            headers: {
                "Content-type": "application/json; charset=UTF-8", // Indicates the content
            },
            body: JSON.stringify({}),
        };

        fetch(
            ApiConstants.poll +
                "?groupId=" +
                pollSeletedId +
                "&pollTableOnly=true",
            DELETEMethod
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.type == "Error") {
                    seterror(true)
                    setErrormsg(data.message);
                    setLoading(false);
                } else {
                    launchPoll();
                }
            });
    };
    const endedautoPoll = () => {
        setLoading(true);
        setPollcounttime(0);
        setapicall(false);
        setPolllauched(false);
        setisDisabledSelect(true);
        setEndautopoll(true);
        setTimer("00:00:00");

        setPollcounttime(0);
        let currentdate = new Date();

        currentdate.toISOString();

        const PATCHMethod = {
            method: "PATCH", // Method itself
            headers: {
                "Content-type": "application/json; charset=UTF-8", // Indicates the content
            },
            body: JSON.stringify({
                endDateTime: currentdate,
                id: pollSeletedId,
                duration: pollcounttime,
                meetingId: ApplicationConstants.meetingId,

                status: "Ended",
                updatedUserId: ApplicationConstants.userId,
            }),
        };

        // make the HTTP put request using fetch api

        fetch(ApiConstants.pollGroup + "/id=" + pollSeletedId, PATCHMethod)
            .then((response) => response.json())
            .then((data) => {
                if (data.type == "Error") {
                    seterror(true)
                    setErrormsg(data.message);
                    setLoading(false);
                } else {
                    getSeletecdpoll(pollSeletedId);
                    setisDisabledSelect(false);
                }
            });
    };

    const endedPollclose = () => {
        setPollcounttime(0);
        setapicall(false);
        setPolllauched(false);
        setisDisabledSelect(false);
        setTimer("00:00:00");
        setEndautopoll(false);
    };

    const endedPoll = () => {
        setLoading(true);
        setPollcounttime(0);
        setapicall(false);
        setPolllauched(false);
        setisDisabledSelect(false);
        setTimer("00:00:00");
        //  setTimerCount('00:00:00');
        setPollcounttime(0);
        let currentdate = new Date();

        currentdate.toISOString();

        const PATCHMethod = {
            method: "PATCH", // Method itself
            headers: {
                "Content-type": "application/json; charset=UTF-8", // Indicates the content
            },
            body: JSON.stringify({
                endDateTime: currentdate,
                id: pollSeletedId,
                duration: pollcounttime,
                meetingId: ApplicationConstants.meetingId,

                status: "Ended",
                updatedUserId: ApplicationConstants.userId,
            }),
        };

        // make the HTTP put request using fetch api

        fetch(ApiConstants.pollGroup + "/id=" + pollSeletedId, PATCHMethod)
            .then((response) => response.json())
            .then((data) => {
                if (data.type == "Error") {
                    seterror(true)
                    setErrormsg(data.message);
                    setLoading(false);
                } else {
                    getSeletecdpoll(pollSeletedId);
                    setisDisabledSelect(false);
                }
            });
    };

    return (
<>
        {error?

            <>
            <div
                    style={{
                        background: "#292929",
                        borderRadius: "8px",
                        border: "1px solid #666",
                        margin: "16px",
                        padding: "45px 5px",
                        marginTop: "13%",
                        wordBreak: "break-word",    lineHeight:'30px' 
                    }}
                >
                    <div
                        style={{
                            color: "#ed5757",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: "8px",
                        }}
                    >
                        <div className="jitsi-icon " style={{ padding: 30 }}>
                            <svg
                                fill="#ed5757"
                                height="75"
                                width="75"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
                            </svg>
                        </div>

                        <div
                            style={{
                                marginLeft: "5px",
                                fontSize: "25px",
                                fontWeight: "bold",
                            }}
                        >
                            {" "}
                          {errormsg}
                        </div>
                    </div>
                    <div
                        style={{
                            marginRight: 35,
                            display: "flex",
                            justifyContent: "space-around",
                            margin: "auto",
                            marginTop: 60,
                            width: "50%",
                        }}
                    >

<Button
                                    type="button"
                                    onClick={() => {
                                        seterror(false)
                                        setLoading(false);
                                    }}
                                    className="add-btn"
                                    style={{
                                        color: "#040404",
                                        borderRadius: "6px",
                                        padding: "5px 10px",
                                        display: "flex",
                                        WebkitAlignItems: "center",
                                        WebkitBoxAlign: "center",

                                        alignItems: "center",
                                        WebkitBoxPack: "center",

                                        WebkitJustifyContent: "center",
                                        justifyContent: "center",
                                        border: "0",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                        fontWeight: "600",
                                        letterSpacing: "0",
                                        WebkitTransition: "background .2s",
                                        transition: "background .2s",
                                        cursor: "pointer",
                                        backgroundColor: "#E0E0E0",
                                    }}
                                >
                                    <span>OK </span>
                                </Button>
                   
                    
                    </div>
                </div>
</>:
        <>
            {" "}
            {!createPollState && !editPollState && !deletePollState ? (
                <div
                    className="polls-pane-content"
                    style={{ minHeight: "82vh" }}
                >
                    <div className="poll-container-admin">
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            getOptionLabel={(option: any) =>
                                `${option.label} - (total questions:  ${option.questionCount})`
                            }
                            onChange={onChange}
                            isDisabled={isDisabledSelect}
                            pageSize={20}
                            isSearchable={true}
                            name="polls"
                            options={pollOptions}
                        />
                        {showDeletemessage || showAddmessagein ? (
                            <div>
                                <div
                                    style={{
                                        background: "#292929",
                                        borderRadius: "8px",
                                        border: "1px solid #666",
                                        margin: "16px",
                                        padding: "45px 5px",
                                        marginTop: "13%",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "green",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            padding: "8px",
                                        }}
                                    >
                                        <div
                                            className="jitsi-icon "
                                            style={{ padding: 30 }}
                                        >
                                            <svg
                                                fill="green"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="85"
                                                height="85"
                                                viewBox="0 0 24 24"
                                            >
                                                <title>check</title>
                                                <path d="M9 16.172l10.594-10.594 1.406 1.406-12 12-5.578-5.578 1.406-1.406z"></path>
                                            </svg>
                                        </div>

                                        {showDeletemessage ? (
                                            <div
                                                style={{
                                                    marginLeft: "5px",
                                                    fontSize: "30px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {" "}
                                                Poll deleted successfully !
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    marginLeft: "5px",
                                                    fontSize: "30px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {" "}
                                                Poll saved successfully
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {!loading ? (
                                    <div
                                        style={{
                                            minHeight: "68vh",
                                            maxHeight: "68vh",
                                            fontWeight: "bold",
                                            fontSize: 16,
                                        }}
                                    >
                                        {pollResult != null && !endautopoll ? (
                                            pollResult ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        padding: 15,
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    {/* <h2>{timer}</h2> */}
                                                    <h2
                                                        style={{
                                                            fontSize: 26,
                                                            display: "flex",
                                                            fontWeight: "500",
                                                            color: "#ed5757",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <Icon
                                                            color="#ed5757"
                                                            size={30}
                                                            src={IconTimerRed}
                                                        />
                                                        <div
                                                            style={{
                                                                marginLeft: 10,
                                                            }}
                                                        >
                                                            {" "}
                                                            {pollcounttime != 0
                                                                ? timer
                                                                : timerCount}
                                                        </div>
                                                    </h2>

                                                    <button
                                                        aria-label="EndPoll"
                                                        onClick={endedPoll}
                                                        className="pollbtn"
                                                        style={{
                                                            width: "100%",
                                                            fontWeight: "bold",
                                                            fontSize: 18,
                                                        }}
                                                        title="EndPoll"
                                                        type="button"
                                                    >
                                                        End Poll
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        padding: 1,
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <Icon
                                                            style={{
                                                                margin: 5,
                                                            }}
                                                            size={30}
                                                            src={IconTimer}
                                                        />
                                                        <Input
                                                            type="number"
                                                            value={
                                                                pollcounttime
                                                            }
                                                                    onChange={(val) => {
                                                                        parseInt(val) >=
                                                                            0
                                                                            ? setPollcounttime(
                                                                                parseInt(
                                                                                    val
                                                                                )
                                                                            )
                                                                            : null;
                                                                    }}
                                                            name="tentacles"
                                                            placeholder="Poll Duration in Seconds"
                                                        />
                                                    </div>
                                                    {!pollRelaunch ? (
                                                        <button
                                                            aria-label="Launch the poll"
                                                            onClick={launchPoll}
                                                            className="pollbtn"
                                                            style={{
                                                                width: "50%",
                                                                fontWeight:
                                                                    "bold",
                                                                fontSize: 18,
                                                            }}
                                                            title="Launch the poll"
                                                            type="button"
                                                        >
                                                            Launch
                                                        </button>
                                                    ) : (
                                                        <div>
                                                            <button
                                                                aria-label="Relaunch the poll"
                                                                onClick={
                                                                    relaunchPoll
                                                                }
                                                                className="pollbtn"
                                                                style={{
                                                                    width: "100%",
                                                                    fontWeight:
                                                                        "bold",
                                                                    fontSize: 18,
                                                                }}
                                                                title="Relaunch the poll"
                                                                type="button"
                                                            >
                                                                Relaunch
                                                            </button>
                                                            <div
                                                                style={{
                                                                    color: "#ed5757",
                                                                    padding: 8,
                                                                    display:
                                                                        "flex",
                                                                }}
                                                            >
                                                                <Icon
                                                                    color="#ed5757"
                                                                    size={19}
                                                                    src={
                                                                        IconWarning
                                                                    }
                                                                />{" "}
                                                                <div
                                                                    style={{
                                                                        marginLeft: 5,
                                                                        fontSize: 18,
                                                                        fontWeight:
                                                                            "bold",
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    On Relaunch,
                                                                    this poll
                                                                    related
                                                                    result will
                                                                    be deleted
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        ) : endautopoll ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    padding: 10,
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                {/* <h2>{timer}</h2> */}
                                                <h2
                                                    style={{
                                                        fontSize: 26,
                                                        display: "flex",
                                                        fontWeight: "500",
                                                        color: "#ed5757",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <span>Poll is Ended</span>
                                                </h2>

                                                <button
                                                    aria-label="EndPoll"
                                                    onClick={endedPollclose}
                                                    className="pollbtn"
                                                    style={{
                                                        width: "100%",
                                                        fontWeight: "bold",
                                                        fontSize: 18,
                                                    }}
                                                    title="EndPoll"
                                                    type="button"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        ) : null}

                                        {pollAns}
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            minHeight: "50vh",
                                            textAlign: "center",
                                            padding: "10%",
                                        }}
                                    >
                                        {" "}
                                        {/* <Spinner
                            // @ts-ignore
                            isCompleting={false}
                            size="large"
                        /> */}
                                        <div
                                            style={{
                                                marginTop: 80,
                                                height: 500,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    margin: "auto",
                                                    width: "25%",
                                                    height: "55%",

                                                    borderRadius: "5px",
                                                    alignItems: "center",
                                                    display: "block",
                                                    padding: "20px",
                                                    // boxSizing: "border-box",
                                                    overflow: "auto",
                                                    outline: 0,
                                                    // minHeight: "inherit",
                                                    // maxHeight: "inherit",
                                                }}
                                            >
                                                <RingLoader
                                                    cssOverride={{
                                                        margin: "auto",
                                                        width: "25%",
                                                        height: "30%",
                                                    }}
                                                    color={"white"}
                                                    loading={loading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            bottom: 10,
                            justifyContent: "space-between",
                            padding: 20,
                            position: "absolute",
                        }}
                    >
                        <Button
                            accessibilityLabel="Create Poll"
                            labelKey="Create Poll"
                            onClick={() => setcreatePollState(true)}
                        />

                        {!showDeletemessage &&
                        !showAddmessagein &&
                        pollResult != null &&
                        !endautopoll &&
                        !pollResult ? (
                            <div
                                style={{
                                    marginRight: 35,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: 180,
                                }}
                            >
                                <Button
                                    accessibilityLabel="Edit Poll"
                                    labelKey="Edit Poll"
                                    type="secondary"
                                    onClick={() => seteditPollState(true)}
                                />
                                <Button
                                    accessibilityLabel="Delete Poll"
                                    labelKey="Delete"
                                    onClick={() => setdeletePollState(true)}
                                    type="secondary"
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : createPollState ? (
                <CreatePoll />
            ) : editPollState ? (
                <EditPoll showpollid={pollSeletedId} />
            ) : deletePollState ? (
                <div
                    style={{
                        background: "#292929",
                        borderRadius: "8px",
                        border: "1px solid #666",
                        margin: "16px",
                        padding: "45px 5px",
                        marginTop: "13%",
                        wordBreak: "break-word",
                    }}
                >
                    <div
                        style={{
                            color: "#ed5757",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: "8px",
                        }}
                    >
                        <div className="jitsi-icon " style={{ padding: 30 }}>
                            <svg
                                fill="#ed5757"
                                height="75"
                                width="75"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
                            </svg>
                        </div>

                        <div
                            style={{
                                marginLeft: "5px",
                                fontSize: "25px",
                                fontWeight: "bold",
                            }}
                        >
                            {" "}
                            Are you sure you want to delete {PollSeleted}?{" "}
                        </div>
                    </div>
                    <div
                        style={{
                            marginRight: 35,
                            display: "flex",
                            justifyContent: "space-around",
                            margin: "auto",
                            marginTop: 60,
                            width: "50%",
                        }}
                    >
                        <Button
                            accessibilityLabel="Cancel"
                            labelKey="Cancel"
                            type="secondary"
                            onClick={() => setdeletePollState(false)}
                        />
                        <Button
                            accessibilityLabel="Delete Poll"
                            labelKey="Delete"
                            type="secondary"
                            onClick={deletePoll}
                        />
                    </div>
                </div>
            ) : null}
        </>}</>
    );
};
export default poll;
