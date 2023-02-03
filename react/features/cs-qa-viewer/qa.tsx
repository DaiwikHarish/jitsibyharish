import React, { useCallback, useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import { IReduxState } from "../app/types";
import { IQuestionDto, QANotificationDto } from "../base/cs-socket/types";
import { ApiConstants } from "../../../ApiConstants";
import { ApplicationConstants } from "../../../ApplicationConstants";

const MessageContainerQA = () => {
    const inputReference = useRef(document.createElement("div"));
    const socketQaMessage = useSelector(
        (state: IReduxState) => state["features/base/cs-socket"].socketQaMessage
    );

    const inputReferenceinpute = useRef(document.createElement("textarea"));
    const [qa, setqa] = useState("");
    const [allQa, setAllQa] = useState([]as any);
    const [allQaDiv, setAllQaDiv] = useState([]);

    //on load first time
    useEffect(() => {
        qaFormAPI();
        if (inputReference != null) {
            inputReference.current.focus();
        }
        if (inputReferenceinpute != null) {
            inputReferenceinpute.current.focus();
        }
    }, []);

    useEffect(() => {
        socketQaMessage != null ? qaFormsocketQaMessage() : null;

        if (inputReference != null) {
            inputReference.current.focus();
        }
        if (inputReferenceinpute != null) {
            inputReferenceinpute.current.focus();
        }
    }, [socketQaMessage]);

    return (
        <div className="chat-panel">
            <div id="chat-conversation-container">
                <div
                    aria-labelledby="QA-header"
                    id="chatconversation"
                    role="log"
                >
                    {allQaDiv}
                    <div ref={inputReference} tabIndex={1} id="QaListEnd"></div>
                </div>{" "}
            </div>
            <div className="chat-input-container">
                <div id="chat-input" style={{ width: "100%" }}>
                    <div className="css-1b1hdkw-inputContainer QA-input">
                        <div className="css-1m7m6m3-fieldContainer">
                            <textarea
                                value={qa}
                                id="qaInput"
                                ref={inputReferenceinpute}
                                onChange={(e) => {
                                    if (inputReferenceinpute != null) {
                                        inputReferenceinpute.current.focus();
                                    }

                                    e.preventDefault();
                                    setqa(e.target.value);
                                }}
                                className="css-qa-input icon-input"
                                placeholder="Your Question here"
                                style={{ height: 40 }}
                            ></textarea>
                        </div>
                    </div>
                    <button
                        aria-label="Send"
                        onClick={() => qaSend(qa)}
                        className="iconButton qabackbtn"
                        style={{ backgroundColor: "#094b85" }}
                        title="Send"
                        type="button"
                    >
                        <div className="jitsi-icon jitsi-icon-default ">
                            <svg
                                fill="none"
                                height="20"
                                width="20"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    clip-rule="evenodd"
                                    d="m16.667 1.667-15 9.166 5.966.995.7 5.255 2.311-3.85 6.023 4.684V1.667Zm-7.93 8.655L6.35 9.924 15 4.638v9.87l-3.684-2.864L12.5 7.5l-3.763 2.822Z"
                                ></path>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>{" "}
        </div>
    );
    async function qaSend(Question: string) {
        if (
            Question.trim() != "" &&
            Question.trim() != undefined &&
            Question.trim() != null
        ) {
            const reqBody = {
                meetingId: ApplicationConstants.meetingId,
                fromUserId: ApplicationConstants.userId,
                question: Question,
            };

            const res = fetch(`${ApiConstants.question}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody),
            });

            if ((await res).ok) {
                qaFormAPI();
                setqa("");
                return true;
            }
        }
    }

    function qaFormAPI() {
        fetch(ApiConstants.question)
            .then((response) => response.json())
            .then((data) => {
                let qaDiv = data.map(
                    (item: {
                        fromUserName: any;
                        answers: any;
                        question: any;
                    }) => (
                        <div className="qa-message-group local">
                            <div className="chatmessage-wrapper" id="1">
                                <div className="chatmessage  lobbymessage">
                                    <div className="replywrapper">
                                        <div className="messagecontent">
                                            <div
                                                aria-hidden="false"
                                                className="display-name"
                                            >
                                                {item.fromUserName}
                                            </div>
                                            <div className="usermessage">
                                                <div
                                                    style={{
                                                        color: "rgb(171, 195, 224)",
                                                        fontWeight: "normal",
                                                    }}
                                                >
                                                    Awesomereview stuff{" "}
                                                    {item.answers[0] !=
                                                    undefined
                                                        ? item.answers[0].sendTo.replace(
                                                              "Send",
                                                              ""
                                                          )
                                                        : ""}
                                                </div>
                                                <span className="sr-only"></span>
                                                <div
                                                    style={{
                                                        fontWeight: "bold",
                                                        paddingBottom: 5,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "rgb(164, 184, 209)",
                                                        }}
                                                    >
                                                        Q :{" "}
                                                    </span>
                                                    {item.question}{" "}
                                                </div>

                                                {item.answers.map(
                                                    (ans: { answer: any }) => (
                                                        <div>
                                                            <span
                                                                style={{
                                                                    color: "rgb(164, 184, 209)",
                                                                }}
                                                            >
                                                                A :{" "}
                                                            </span>{" "}
                                                            {ans != undefined
                                                                ? ans.answer
                                                                : ""}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <div></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="timestamp"></div>
                            </div>
                        </div>
                    )
                );
                setAllQa(data);

                setAllQaDiv(qaDiv);

                if (inputReference != null) {
                    inputReference.current.focus();
                }
            });
    }
    function qaFormsocketQaMessage() {
        let socktedata: IQuestionDto;
        socktedata = socketQaMessage != null ? socketQaMessage.data : {};

        console.log(socktedata)
//alert(socktedata)
        allQa.map(function (obj: { id: any; answers: any }) {
            obj.id === socktedata.id && (obj.answers = socktedata.answers)
           
        });

        
     if(allQa[allQa.length-1].answers!=[])
     {
        allQa[allQa.length-1]=socktedata

     }
        let qaDiv: any = allQa.map(
            (item: { fromUserName: any; answers: any; question: any }) => (
                <div className="qa-message-group local">
                    <div className="chatmessage-wrapper" id="1">
                        <div className="chatmessage  lobbymessage">
                            <div className="replywrapper">
                                <div className="messagecontent">
                                    <div
                                        aria-hidden="false"
                                        className="display-name"
                                    >
                                        {item.fromUserName}
                                    </div>
                                    <div className="usermessage">
                                        <div
                                            style={{
                                                color: "rgb(171, 195, 224)",
                                                fontWeight: "normal",
                                            }}
                                        >
                                            Awesomereview stuff{" "}
                                            {item.answers[0] != undefined
                                                ? item.answers[0].sendTo
                                                : ""}
                                        </div>
                                        <span className="sr-only">says:</span>
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                paddingBottom: 5,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "rgb(164, 184, 209)",
                                                }}
                                            >
                                                Q :{" "}
                                            </span>
                                            {item.question}{" "}
                                        </div>
                                        {item.answers.map(
                                            (ans: { answer: any }) => (
                                                <div>
                                                    <span
                                                        style={{
                                                            color: "rgb(164, 184, 209)",
                                                        }}
                                                    >
                                                        A :{" "}
                                                    </span>{" "}
                                                    {ans != undefined
                                                        ? ans.answer
                                                        : ""}
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="timestamp"></div>
                    </div>
                </div>
            )
        );
        setAllQa(allQa);
        setAllQaDiv(qaDiv);
    }
};

export default MessageContainerQA;
