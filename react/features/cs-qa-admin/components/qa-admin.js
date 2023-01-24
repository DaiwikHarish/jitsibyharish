import React, { useEffect, useState } from 'react';
import Modal, {
    ModalBody,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/standard-button';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
// import 'react-calendar/dist/Calendar.css';

import { IQuestionAnswer } from '../../base/app/types';
import '../qa-admin.css';
import {
    Icon,
    IconClose,
    IconFlag,
    IconParticipants,
    IconTrash,
    IconUser,
    IconUserGroups,
} from '../../base/icons';
// import Datepicker from 'react-datetime-picker';
import { getLocalizedDateFormatter } from '../../base/i18n';
import {
    deleteQuestion,
    loadQuestionAnswers,
    postAnswer,
    selectedEndDate,
    selectedQuestion,
    selectedStartDate,
} from '../actions';
import { IReduxState } from '../../app/types';
import { hideDialog } from '../../base/dialog';
import { QuestionType } from '../types';

const boldStyles = css({
    backgroundColor: 'rgb(29, 35, 46)',
    display: 'flex',
});

const DATE_FORMAT = 'DD/MM/YYYY';
const REQUEST_DATETIME_FORMAT = 'YYYY-MM-DDTHH:MM:SS';

const QuestionAnswer = () => {
    const dispatch = useDispatch();
    const [selectedQA, setSelectedQA] = useState();
    const [selectedIndex, setSelectedIndex] = useState();
    const [searchInput, setSearchInput] = useState('');
    const [messageSend, setMessageSend] = useState(false);
    const [message, setMessage] = useState(selectedQA?.answer);
    const [openModal, setOpenModal] = useState(false);
    const [radioChecked, setRadioChecked] = useState(QuestionType.Both);

    const questionAnswerList: IQuestionAnswer[] | undefined = useSelector(
        (state: IReduxState) => {
            if (radioChecked === QuestionType.NotAnswered) {
                return state['features/cs-qa-admin'].unAnsweredQA;
            } else if (radioChecked === QuestionType.Answered) {
                return state['features/cs-qa-admin'].answeredQA;
            } else {
                return state['features/cs-qa-admin'].questionAnswers;
            }
        }
    );

    const selectedQuestionId: number = useSelector(
        (state: IReduxState) => state['features/cs-qa-admin'].selectedQuestionId
    );

    const totalQA: number = useSelector(
        (state: IReduxState) => state['features/cs-qa-admin'].total
    );

    const answeredCount: number = useSelector(
        (state: IReduxState) => state['features/cs-qa-admin'].answeredCount
    );

    const unAnsweredCount: number = useSelector(
        (state: IReduxState) => state['features/cs-qa-admin'].unAnsweredCount
    );

    const updateStartDate: string | Date = useSelector(
        (state: IReduxState) => state['features/cs-qa-admin'].startDate
    );
    const updateEndDate: string | Date = useSelector(
        (state: IReduxState) => state['features/cs-qa-admin'].endDate
    );
    console.log('alam updateStartDate', updateStartDate);
    console.log('alam unAnswered', updateEndDate);
    function _hideDialog() {
        dispatch(hideDialog(QuestionAnswer));
    }

    useEffect(() => {
        dispatch(loadQuestionAnswers(updateStartDate, updateEndDate));
    }, [radioChecked, updateStartDate, updateEndDate, messageSend]);

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
                        onClick={() =>
                            dispatch(
                                loadQuestionAnswers(
                                    updateStartDate,
                                    updateEndDate
                                )
                            )
                        }
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
                        // defaultValue={updateStartDate}
                        maxLength={25}
                        name={'startDate'}
                        onChange={(e) => {
                            dispatch(selectedStartDate(e.target.value));
                        }}
                        // onKeyPress = { onKeyPress }
                        placeholder={'StartDate'}
                        value={updateStartDate}
                        max={updateEndDate}
                    />

                    <input
                        type="date"
                        className="q-search"
                        // defaultValue={updateEndDate}
                        maxLength={25}
                        name={'endDate'}
                        onChange={(e) =>
                            dispatch(selectedEndDate(e.target.value))
                        }
                        // onKeyPress = { onKeyPress }
                        placeholder={'EndDate'}
                        value={updateEndDate}
                        min={updateStartDate}
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
                    Unanswered ({unAnsweredCount}
                    )
                    <input
                        className="radio-btn"
                        type="radio"
                        value="Answered"
                        name="QA"
                        onChange={(e) => setRadioChecked(e.target.value)}
                        checked={radioChecked === 'Answered'}
                    />{' '}
                    Answered ({answeredCount}
                    )
                    <input
                        className="radio-btn"
                        type="radio"
                        value="Both"
                        name="QA"
                        onChange={(e) => setRadioChecked(e.target.value)}
                        checked={radioChecked === 'Both'}
                    />{' '}
                    All ({totalQA})
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
                            dispatch(
                                postAnswer(
                                    message,
                                    selectedQuestionId,
                                    'Send To User'
                                )
                            );
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
                            dispatch(
                                postAnswer(
                                    message,
                                    selectedQuestionId,
                                    'Send To All'
                                )
                            );
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
                                    dispatch(
                                        deleteQuestion(selectedQuestionId)
                                    );
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
