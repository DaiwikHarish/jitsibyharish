import React, { useEffect, useState } from "react";

import Modal, {
    ModalBody,
    ModalTitle,
    ModalTransition,
} from "@atlaskit/modal-dialog";

import Button from "@atlaskit/button/standard-button";
import { useDispatch, useSelector } from "react-redux";
import { css } from "@emotion/react";

import "../qa-admin.css";

//@ts-ignore
import { Icon, IconClose,IconFlag,IconParticipants,IconTrash,IconUser,IconUserGroups} from "../../base/icons";

import {
    deleteQuestion,
    postAnswer,
    qaAction,
    resetQAUnSeenCount,
    selectedQuestion,
    updateQAScreenStatus,
} from "../actions";

import { IReduxState } from "../../app/types";

//@ts-ignore
import { hideDialog } from "../../base/dialog";

import { IQuestionAnswer, QuestionType } from "../types";
import { ICSQaAdminState } from "../reducer";
import moment from "moment";
import { getQaData, getQuestionTypeCount } from "../functions";
import { FadeLoader } from "react-spinners";
import { dumpLog } from "../../app/functions.any";

const boldStyles = css({
    backgroundColor: "white",
    display: "flex",
});

const QuestionAnswer = () => {
    const dispatch = useDispatch();
    const [selectedQA, setSelectedQA] = useState<IQuestionAnswer>();
    const [selectedIndex, setSelectedIndex] = useState<number>();

    const [message, setMessage] = useState<string>('');

    const [openModal, setOpenModal] = useState(false);

    const loading: boolean = useSelector(
        (state: IReduxState) => state["features/cs-qa-admin"]?.isLoading
    );

    const csQaAdminState: ICSQaAdminState = useSelector(
        (state: IReduxState) => {
            return state["features/cs-qa-admin"];
        }
    );

    const searchInput = useSelector((state: IReduxState) => {
        return state["features/cs-qa-admin"]?.searchText;
    });

    const selectedQuestionId: string | null = useSelector(
        (state: IReduxState) =>
            state["features/cs-qa-admin"]?.selectedQuestionId
    );

    const startDateTime: string = useSelector(
        (state: IReduxState) => state["features/cs-qa-admin"].startDateTime
    );

    const endDateTime: string = useSelector(
        (state: IReduxState) => state["features/cs-qa-admin"].endDateTime
    );

    const questionType: QuestionType = useSelector(
        (state: IReduxState) => state["features/cs-qa-admin"].questionType
    );

    const [questionAnswerList, setQuestionAnswerList] = useState<
        IQuestionAnswer[]
    >([]);

    const [totalQA, setTotalQA] = useState<number>(0);

    const [answeredCount, setAnsweredCount] = useState<number>(0);

    const [unAnsweredCount, setUnAnsweredCount] = useState<number>(0);


    dumpLog("alam loading", loading);
    function _hideDialog() {
        dispatch(hideDialog(QuestionAnswer));
    }

    useEffect(() => {
        // trigger firt time on mount
        let fromDateTime = moment().format("YYYY-MM-DD") + "T00:00:00";
        let toDateTime = moment().format("YYYY-MM-DD") + "T23:59:59";

        // reset the count on mount 
        dispatch(resetQAUnSeenCount())

        // set isScreenOn = true on mount 
        dispatch(updateQAScreenStatus(true))
        
        dispatch(qaAction(fromDateTime, toDateTime));

        // set isScreen = false on unmount 
        return () => {
            dispatch(updateQAScreenStatus(false))
        }

    }, []);

    // this will execute when the state changes
    useEffect(() => {
        // qadata
        setQuestionAnswerList(getQaData(csQaAdminState));

        setTotalQA(getQuestionTypeCount(csQaAdminState, QuestionType.Both));
        setAnsweredCount(
            getQuestionTypeCount(csQaAdminState, QuestionType.Answered)
        );
        setUnAnsweredCount(
            getQuestionTypeCount(csQaAdminState, QuestionType.NotAnswered)
        );
    }, [csQaAdminState]);

    /////////////////// methods to filter ///////////////

    const updateQuestionType = (value: string) => {
        let type: QuestionType = QuestionType.Both;
        if (value == QuestionType.Answered) {
            type = QuestionType.Answered;
        } else if (value == QuestionType.NotAnswered) {
            type = QuestionType.NotAnswered;
        } else if (value == QuestionType.Both) {
            type = QuestionType.Both;
        }
        dispatch(qaAction(undefined, undefined, type, undefined));
    };

    return (
        <Modal
            autoFocus={false}
            shouldCloseOnEscapePress={true}
            width={innerWidth}
            height={innerHeight}
            css={boldStyles}
            isChromeless={true}
            scrollBehavior="inside"
        >
            <FadeLoader
                cssOverride={{
                    display: "flex",
                    position: "relative",
                    fontSize: "0px",
                    height: "0px",
                    width: "0px",
                    top: "50%",
                    left: "20px",
                    margin: "auto",
                }}
                color={"white"}
                loading={loading}
            />
            <div className={loading ? "qa-loading-container" : "qa-container"}>
                <div className="qa-header">
                    <div className="qa-title">Questions</div>{" "}
                    <Icon
                        className="qa-btn-close"
                        onClick={_hideDialog}
                        size={24}
                        src={IconClose}
                    />{" "}
                </div>
                <div className="qa-input-container">
                    <button
                        onClick={() =>
                            dispatch(qaAction(startDateTime, endDateTime))
                        }
                        className="qa-btn-refresh"
                    >
                        Refresh
                    </button>
                    <input
                        type="text"
                        className="qa-q-search"
                        maxLength={25}
                        name={"searchInput"}
                        onChange={(e) =>
                            dispatch(
                                qaAction(
                                    undefined,
                                    undefined,
                                    undefined,
                                    e.target.value ? e.target.value : "CS_EMPTY"
                                )
                            )
                        }
                        // onKeyPress = { onKeyPress }
                        placeholder={"Search"}
                        value={searchInput ? searchInput : ""}
                    />
                    <input
                        type="date"
                        className="qa-q-search"
                        // defaultValue={updateStartDate}
                        maxLength={25}
                        name={"startDate"}
                        onChange={(e) => {
                            dispatch(qaAction(e.target.value));
                        }}
                        // onKeyPress = { onKeyPress }
                        placeholder={"StartDate"}
                        value={startDateTime?.split("T")[0]}
                        max={endDateTime?.split("T")[0]}
                    />

                    <input
                        type="date"
                        className="qa-q-search"
                        // defaultValue={updateEndDate}
                        maxLength={25}
                        name={"endDate"}
                        onChange={(e) =>
                            dispatch(qaAction(undefined, e.target.value))
                        }
                        // onKeyPress = { onKeyPress }
                        placeholder={"EndDate"}
                        value={endDateTime?.split("T")[0]}
                        min={startDateTime?.split("T")[0]}
                    />
                </div>
                <div className="qa-radio-btn-container">
                    <input
                        className="qa-radio-btn"
                        type="radio"
                        id="NotAnswered"
                        value="NotAnswered"
                        name="QA"
                        onChange={(e) => {
                            updateQuestionType(e.target.value);
                        }}
                        checked={questionType === QuestionType.NotAnswered}
                    />{" "}
                    <label className='qa-btn-label' htmlFor="NotAnswered">
                        Unanswered ({unAnsweredCount})
                    </label>
                    <input
                        className="qa-radio-btn"
                        type="radio"
                        id="Answered"
                        value="Answered"
                        name="QA"
                        onChange={(e) => updateQuestionType(e.target.value)}
                        checked={questionType === QuestionType.Answered}
                    />{" "}
                    <label className='qa-btn-label' htmlFor="Answered">Answered ({answeredCount})</label>
                    <input
                        className="qa-radio-btn"
                        type="radio"
                        id="Both"
                        value="Both"
                        name="QA"
                        onChange={(e) => updateQuestionType(e.target.value)}
                        checked={questionType === QuestionType.Both}
                    />{" "}
                    <label className='qa-btn-label' htmlFor="Both">All ({totalQA})</label>
                </div>
                <div className="qa-table">
                    <table className='q-table'>
                        <thead>
                            <tr className='qa-tr'>
                                <th className='qa-th' style={{ width: "5%" }}>
                                    <Icon
                                        color="#000"
                                        size={18}
                                        src={IconClose}
                                    />
                                </th>
                                <th className='qa-th' style={{ width: "30%" }}>Question</th>
                                <th className='qa-th' style={{ width: "15%" }}>Asker</th>
                                <th className='qa-th' style={{ width: "13%" }}>Rec'd</th>
                                <th className='qa-th' style={{ width: "12%" }}>Send To</th>
                                <th className='qa-th' style={{ width: "5%" }}>
                                    <Icon
                                        color="#079223"
                                        size={18}
                                        src={IconFlag}
                                    />
                                </th>
                                <th className='qa-th' style={{ width: "30%" }}>Answer</th>
                            </tr>
                        </thead>
                        {questionAnswerList
                            ?.slice(0)
                            .reverse()
                            .map((qa: IQuestionAnswer, index) => (
                                <tbody key={index}>
                                    <tr
                                        onClick={() => {
                                            setSelectedQA(qa);
                                            setSelectedIndex(index);
                                            dispatch(
                                                selectedQuestion(qa.questionId)
                                            );
                                        }}
                                        className={
                                            selectedIndex === index
                                                ? "qa-selected-row"
                                                : 'qa-tr'
                                        }
                                    >
                                        <td className='qa-td'>
                                            <Icon
                                                className="qa-btn-trash"
                                                onClick={() =>
                                                    setOpenModal(true)
                                                }
                                                color="red"
                                                size={18}
                                                src={IconTrash}
                                            />
                                        </td>
                                        <td>
                                            <p className="selected-qa">{qa.question}</p>
                                        </td>
                                        <td className='qa-td'>{qa.fromUserName}</td>
                                        <td className='qa-td'>{qa.questionCreatedAt}</td>
                                        <td className='qa-td'>{qa.sendTo}</td>
                                        <td className='qa-td'>
                                            <Icon
                                                color={
                                                    qa.answeredFlag == true
                                                        ? "#079223"
                                                        : "red"
                                                }
                                                size={18}
                                                src={IconFlag}
                                            />
                                        </td>
                                        <td>
                                            <p className="q">{qa.answer}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                    </table>
                </div>
            </div>
            <div className={loading ? "qa-loading-footer" : "qa-footer"}>
                <div className="qa-footer-q">
                    {" "}
                    {selectedQA === undefined && <p className='selected-footer-qa'> Select a question...</p>}
                    <p className='selected-footer-qa'>{selectedQA?.question}</p>
                </div>
                <textarea
                    rows={3}
                    // type="textarea"
                    placeholder="Enter the answer...."
                    className="qa-footer-a-input"
                    name="message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <div className="qa-footer-a-send-container">
                    <div
                        onClick={() => {
                            dispatch(
                                postAnswer(
                                    message,
                                    selectedQuestionId,
                                    "Send To User"
                                )
                            );
                            setMessage("");
                            setSelectedQA(undefined);
                        }}
                        className="qa-send-type"
                    >
                        <Icon color="#fff" src={IconParticipants} />
                        <label className='qa-btn-label'>Send Privately</label>
                    </div>
                    <div
                        onClick={() => {
                            dispatch(
                                postAnswer(
                                    message,
                                    selectedQuestionId,
                                    "Send To All"
                                )
                            );
                            setMessage("");
                            setSelectedQA(undefined);
                        }}
                        className="qa-send-type"
                    >
                        <Icon src={IconUserGroups} />
                        <label className='qa-btn-label'>Send To All</label>
                    </div>
                </div>
            </div>
            <ModalTransition
                css={css({
                    marginTop: "25%",
                })}
            >
                {openModal && (
                    <Modal onClose={() => setOpenModal(false)}>
                        <div className="qa-warning-modal-header">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                role="presentation"
                                color="yellow"
                                className="qa-svg"
                            >
                                <g fillRule="evenodd">
                                    <path
                                        d="M12.938 4.967c-.518-.978-1.36-.974-1.876 0L3.938 18.425c-.518.978-.045 1.771 1.057 1.771h14.01c1.102 0 1.573-.797 1.057-1.771L12.938 4.967z"
                                        fill="currentColor"
                                    ></path>
                                    <path
                                        d="M12 15a1 1 0 01-1-1V9a1 1 0 012 0v5a1 1 0 01-1 1m0 3a1 1 0 010-2 1 1 0 010 2"
                                        fill="inherit"
                                    ></path>
                                </g>
                            </svg>
                            <ModalTitle
                                aria-label="warning icon"
                                data-appearance="warning"
                            >
                                Delete
                            </ModalTitle>
                        </div>
                        <ModalBody className="qa-warning-modal-body">
                            Are you sure you want to delete{" "}
                            <span className="qa-span-qus">
                                {selectedQA?.question} {"?"}
                            </span>
                        </ModalBody>
                        <div className="qa-warning-modal-footer">
                            <Button
                                onClick={() => setOpenModal(false)}
                                appearance="subtle"
                            >
                                Cancel
                            </Button>
                            <Button
                                appearance="warning"
                                onClick={() => {
                                    // onDeleteQA(selectedQA?.id);
                                    dispatch(
                                        deleteQuestion(selectedQuestionId)
                                    );
                                    setOpenModal(false);
                                    setSelectedQA(undefined);
                                }}
                                autoFocus
                            >
                                Delete
                            </Button>
                        </div>
                    </Modal>
                )}
            </ModalTransition>
        </Modal>
    );
};

export default QuestionAnswer;
