import React, { useEffect, useState } from 'react';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/standard-button';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
// import 'react-calendar/dist/Calendar.css';

import {
    IAttendeeInfo,
    IQuestionAnswer,
    IQuestion,
} from '../../base/app/types';
import { hideDialog } from '../../base/dialog';
import { ApiConstants } from '../../../../ApiConstants';
import { ApplicationConstants } from '../../../../ApplicationConstants';
import '../qa-admin.css';
import {
    Icon,
    IconClose,
    IconFlag,
    IconParticipants,
    IconPlusCalendar,
    IconTrash,
    IconUser,
    IconUserGroups,
} from '../../base/icons';
// import Datepicker from 'react-datetime-picker';
import { getLocalizedDateFormatter } from '../../base/i18n';
import moment from 'moment';
import {
    deleteQuestion,
    loadQuestionAnswers,
    postAnswer,
    selectedQuestion,
} from '../actions';
import { IReduxState } from '../../app/types';

const boldStyles = css({
    backgroundColor: 'rgb(29, 35, 46)',
    display: 'flex',
});

const DATE_FORMAT = 'DD/MM/YYYY';
const REQUEST_DATETIME_FORMAT = 'YYYY-MM-DDTHH:MM:SS';

const QuestionAnswer = () => {
    const dispatch = useDispatch();

    const [question, setQuestion] = useState();
    const [questionCount, setQuestionCount] = useState();
    const [openPicker, setOpenPicker] = useState(false);
    const [selectedQA, setSelectedQA] = useState();
    const [selectedIndex, setSelectedIndex] = useState();
    const [searchInput, setSearchInput] = useState('');
    const [message, setMessage] = useState();
    const [messageSend, setMessageSend] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [radioChecked, setRadioChecked] = useState('Both');
    const [startDate, setStartDate] = useState(
        new Date().toLocaleDateString('en-CA')
    );
    const [endDate, setEndDate] = useState(
        new Date().toLocaleDateString('en-CA')
    );
    // const [startDate, setStartDate] = useState(new Date());
    // const [endDate, setEndDate] = useState(new Date());
    const [answer, setAnswer] = useState();

    const questionAnswerList: IQuestionAnswer[] | undefined = useSelector(
        (state: IReduxState) => state['features/cs-qa-admin'].questionAnswers
    );

    const selectedQuestionId: number = useSelector(
        (state: IReduxState) => state['features/cs-qa-admin'].selectedQuestionId
    );
    console.log('alam qaList', questionAnswerList);
    function _hideDialog() {
        dispatch(hideDialog(QuestionAnswer));
    }

    const show = () => {
        setOpenPicker(true);
    };
    const onClose = () => {
        setOpenPicker(false);
    };

    /**
     * Fetching Question Answers API.
     */
    const FetchQuestionAnswers = async () => {
        // let url: string;

        if (startDate && endDate && startDate > endDate) {
            return alert("Start date can't be greater than End date!");
        }

        // const url =
        //     ApplicationConstants.API_BASE_URL +
        //     'question?meetingId=' +
        //     ApplicationConstants.meetingId;
        // // +
        // // `&questionFilterFlag=${radioChecked}`;
        const url =
            ApplicationConstants.API_BASE_URL +
            'question?meetingId=' +
            ApplicationConstants.meetingId +
            '&startDateTime=' +
            moment(startDate).toISOString().split('.')[0] +
            '&endDateTime=' +
            moment(`${endDate}T23:59:59`).toISOString().split('.')[0] +
            `&questionFilterFlag=Both`;
        // console.log('alam url', url);
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const questions: IQuestion = data;
                // console.log('alam questions', questions);
                let qaArray: IQuestionAnswer[] = [];
                for (let x of questions) {
                    if (x.answers.length == 0) {
                        let qa: IQuestionAnswer = {};
                        // question part
                        qa.id = x.id;
                        qa.meetingId = x.meetingId;
                        qa.question = x.question;
                        qa.fromUserId = x.fromUserId;
                        qa.fromUserName = x.fromUserName;
                        qa.createdAt = x.createdAt;
                        qaArray.push(qa);
                    } else {
                        for (let y of x.answers) {
                            let qa: IQuestionAnswer = {};
                            // question part
                            qa.id = x.id;
                            qa.meetingId = x.meetingId;
                            qa.question = x.question;
                            qa.fromUserId = x.fromUserId;
                            qa.fromUserName = x.fromUserName;
                            qa.createdAt = x.createdAt;

                            // answer part
                            qa.answerId = y.id;
                            qa.answer = y.answer;
                            qa.sendTo = y.sendTo;
                            qaArray.push(qa);
                        }
                    }
                }
                setQuestionCount(qaArray);
                if (radioChecked === 'NotAnswered') {
                    setQuestion(qaArray.filter((q) => q.answer === undefined));
                } else if (radioChecked === 'Answered') {
                    setQuestion(qaArray.filter((q) => q.answer !== undefined));
                } else {
                    setQuestion(qaArray);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const onSendMessage = async (msg, qId, sendType) => {
        if (msg === undefined || msg === '') {
            return;
        }

        if (qId === undefined || qId === '') {
            return;
        }

        fetch(ApiConstants.answer, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                meetingId: ApplicationConstants.meetingId,
                fromUserId: ApplicationConstants.userId,
                answer: msg,
                questionId: qId,
                sendTo: sendType,
            }),
        })
            .then((response) => {
                response.json();
            })
            .then((data) => {
                FetchQuestionAnswers();
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const onDeleteQA = (qId) => {
        fetch(
            ApplicationConstants.API_BASE_URL +
                'question?meetingId=' +
                ApplicationConstants.meetingId +
                `&questionId=${qId}`,
            {
                method: 'DELETE',
            }
        )
            .then((response) => {
                response.json();
            })
            .then((data) => {
                console.log('Successfully Deleted', qId);
                FetchQuestionAnswers();
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    useEffect(() => {
        FetchQuestionAnswers();
        dispatch(loadQuestionAnswers(startDate, endDate));
    }, [radioChecked, startDate, endDate, messageSend]);

    // console.log('alam startDate', startDate);
    // console.log('alam endDate', endDate);

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
            <div className="Container">
                <div className="header">
                    <div className="title">Questions</div>{' '}
                    <Icon
                        className="btn-close"
                        onClick={_hideDialog}
                        size={24}
                        src={IconClose}
                    />{' '}
                </div>
                <div className="input-container">
                    <button
                        onClick={() => FetchQuestionAnswers()}
                        className="btn-refresh"
                    >
                        Refresh
                    </button>
                    <input
                        type="text"
                        className="q-search"
                        maxLength={25}
                        name={'searchInput'}
                        onChange={(e) => setSearchInput(e.target.value)}
                        // onKeyPress = { onKeyPress }
                        placeholder={'Search'}
                        value={searchInput}
                    />
                    <input
                        type="date"
                        className="q-search"
                        defaultValue={new Date().toLocaleDateString('en-CA')}
                        maxLength={25}
                        name={'startDate'}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                        }}
                        // onKeyPress = { onKeyPress }
                        placeholder={'StartDate'}
                        value={startDate}
                        max={endDate}
                    />

                    <input
                        type="date"
                        className="q-search"
                        defaultValue={new Date().toLocaleDateString('en-CA')}
                        maxLength={25}
                        name={'endDate'}
                        onChange={(e) => setEndDate(e.target.value)}
                        // onKeyPress = { onKeyPress }
                        placeholder={'EndDate'}
                        value={endDate}
                        min={startDate}
                    />
                </div>
                <div className="radio-btn-container">
                    <input
                        className="radio-btn"
                        type="radio"
                        value="NotAnswered"
                        name="QA"
                        onChange={(e) => setRadioChecked(e.target.value)}
                        checked={radioChecked === 'NotAnswered'}
                    />{' '}
                    Unanswered (
                    {
                        // question?.length
                        questionAnswerList?.filter(
                            (q) => q.answer === undefined
                        ).length
                    }
                    )
                    <input
                        className="radio-btn"
                        type="radio"
                        value="Answered"
                        name="QA"
                        onChange={(e) => setRadioChecked(e.target.value)}
                        checked={radioChecked === 'Answered'}
                    />{' '}
                    Answered (
                    {
                        // question?.length
                        questionAnswerList?.filter(
                            (q) => q.answer !== undefined
                        ).length
                    }
                    )
                    <input
                        className="radio-btn"
                        type="radio"
                        value="Both"
                        name="QA"
                        onChange={(e) => setRadioChecked(e.target.value)}
                        checked={radioChecked === 'Both'}
                    />{' '}
                    All ({questionAnswerList?.length})
                </div>
                <div className="qa-table">
                    <table>
                        <thead>
                            <tr>
                                <th width="5%">
                                    <Icon
                                        color="#000"
                                        size={18}
                                        src={IconClose}
                                    />
                                </th>
                                <th width="30%">Question</th>
                                <th width="15%">Asker</th>
                                <th width="13%">Rec'd</th>
                                <th width="12%">Send To</th>
                                <th width="5%">
                                    <Icon
                                        color="#079223"
                                        size={18}
                                        src={IconFlag}
                                    />
                                </th>
                                <th width="30%">Answer</th>
                            </tr>
                        </thead>
                        {questionAnswerList
                            ?.slice(0)
                            .reverse()
                            .filter((qus) => {
                                if (searchInput === undefined) {
                                    return qus;
                                } else if (
                                    qus.question
                                        .toLowerCase()
                                        .includes(searchInput.toLowerCase())
                                ) {
                                    return qus;
                                } else if (
                                    qus.fromUserName
                                        .toLowerCase()
                                        .includes(searchInput.toLowerCase())
                                ) {
                                    return qus;
                                } else if (
                                    getLocalizedDateFormatter(
                                        new Date(qus.createdAt)
                                    )
                                        .format(DATE_FORMAT)
                                        .toLowerCase()
                                        .includes(searchInput.toLowerCase())
                                ) {
                                    return qus;
                                } else if (
                                    qus.answer
                                        ?.toLowerCase()
                                        .includes(searchInput.toLowerCase())
                                ) {
                                    return qus;
                                }
                            })
                            .map((qa: IQuestionAnswer, index) => (
                                <tbody key={index}>
                                    <tr
                                        onClick={() => {
                                            setSelectedQA(qa);
                                            setSelectedIndex(index);
                                            dispatch(selectedQuestion(qa.id));
                                        }}
                                        className={
                                            selectedIndex === index
                                                ? 'selected-row'
                                                : ''
                                        }
                                    >
                                        <td>
                                            <Icon
                                                className="btn-trash"
                                                onClick={() =>
                                                    setOpenModal(true)
                                                }
                                                color="red"
                                                size={18}
                                                src={IconTrash}
                                            />
                                        </td>
                                        <td>
                                            <p className="q">{qa.question}</p>
                                        </td>
                                        <td>{qa.fromUserName}</td>
                                        <td>
                                            {getLocalizedDateFormatter(
                                                new Date(qa.createdAt)
                                            ).format(DATE_FORMAT)}
                                        </td>
                                        <td>{qa.sendTo}</td>
                                        <td>
                                            <Icon
                                                color={
                                                    qa.answer !== undefined
                                                        ? '#079223'
                                                        : 'red'
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
            <div className="footer">
                <div className="footer-q">
                    {' '}
                    {selectedQA === undefined && <p> Select a question...</p>}
                    <p>{selectedQA?.question}</p>
                </div>
                <textarea
                    rows={3}
                    type="textarea"
                    placeholder="Enter the answer...."
                    className="footer-a-input"
                    name="message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <div className="footer-a-send-container">
                    <div
                        onClick={() => {
                            // onSendMessage(
                            //     message,
                            //     selectedQA?.id,
                            //     'Send To User'
                            // );
                            dispatch(postAnswer(message, 'Send To User'));
                            setMessageSend(true);
                            setMessage('');
                            setSelectedQA(undefined);
                        }}
                        className="send-type"
                    >
                        <Icon color="#fff" src={IconParticipants} />
                        <label>Send Privately</label>
                    </div>
                    <div
                        onClick={() => {
                            // onSendMessage(
                            //     message,
                            //     selectedQA?.id,
                            //     'Send To All'
                            // );
                            dispatch(postAnswer(message, 'Send To All'));
                            setMessageSend(true);
                            setMessage('');
                            setSelectedQA(undefined);
                        }}
                        className="send-type"
                    >
                        <Icon src={IconUserGroups} />
                        <label>Send To All</label>
                    </div>
                </div>
            </div>
            <ModalTransition
                css={css({
                    marginTop: '25%',
                })}
            >
                {openModal && (
                    <Modal onClose={() => setOpenModal(false)}>
                        <div className="warning-modal-header">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                role="presentation"
                                color="yellow"
                                className="svg"
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
                                appearance="warning"
                            >
                                Delete
                            </ModalTitle>
                        </div>
                        <ModalBody className="warning-modal-body">
                            Are you sure you want to delete{' '}
                            <span className="span-qus">
                                {selectedQA.question} {'?'}
                            </span>
                        </ModalBody>
                        <div className="warning-modal-footer">
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
                                    dispatch(deleteQuestion());
                                    setMessageSend(true);
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
