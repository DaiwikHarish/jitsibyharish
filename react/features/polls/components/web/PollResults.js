// @flow

import React from 'react';

import AbstractPollResults from '../AbstractPollResults';
import type { AbstractProps } from '../AbstractPollResults';
/**
 * Component that renders the poll results.
 *
 * @param {Props} props - The passed props.
 * @returns {React.Node}
 */
const PollResults = (props: AbstractProps) => {
    const {
        answers,
        changeVote,
        creatorName,
        haveVoted,
        pollPercentage,
        showDetails,
        question,
        t,
        toggleIsDetailed,
    } = props;

    const [userName, userType] = creatorName?.split('|');

    return (
        <div className = 'poll-results'>
            <div className = 'poll-header'>
                <div className = 'poll-question'>
                    <strong>{ question }</strong>
                </div>
                {/* <div className = 'poll-creator'>
                    {t('polls.by', { name: userName })}
                </div> */}
            </div>
            <ol className="poll-result-list">
                {answers.map(
                    ({ name, pollPercentage,pollStatistics, voters, voterCount }, index) => (
                        <VoterContainer
                            name={name}
                            pollPercentage={pollPercentage}
                            pollStatistics={pollStatistics}
                            voters={voters}
                            voterCount={pollStatistics}
                            showDetails={showDetails}
                            index={index}
                        />
                    )
                )}
            </ol>
            {/* <div className={'poll-result-links'}>
                <a className={'poll-detail-link'} onClick={toggleIsDetailed}>
                    {showDetails
                        ? t('polls.results.hideDetailedResults')
                        : t('polls.results.showDetailedResults')}
                </a>
                <a className={'poll-change-vote-link'} onClick={changeVote}>
                    {haveVoted
                        ? t('polls.results.changeVote')
                        : t('polls.results.vote')}
                </a>
            </div> */}
        </div>
    );
};

function VoterContainer(props) {
  
    //alert(JSON.stringify(props))
    const [userName, userType] = props.name?.split('|');
    return (
        <li key={props.index}>
            <div className="poll-answer-header">
                <span className="poll-answer-vote-name">{userName}</span>
            </div>
            <div className="poll-answer-short-results">
                <span className="poll-bar-container">
                    <div
                        className="poll-bar"
                        style={{ width: `${ parseInt(props.pollPercentage)}%` }}
                    />
                </span>
                <div className="poll-answer-vote-count-container">
                    <span className="poll-answer-vote-count">
                        ({props.voterCount}) {parseInt(props.pollPercentage)}%
                    </span>
                </div>
            </div>
            {props.showDetails && props.voters && props.voterCount > 0 && (
                <ul className="poll-answer-voters">
                    {props.voters.map((voter) => (
                        <VoterName voter={voter} />
                    ))}
                </ul>
            )}
        </li>
    );
}

function VoterName(props) {
    const [userName, userType] = props.voter.name?.split('|');
    return <li key={props.voter.id}>{userName}</li>;
}

/*
 * We apply AbstractPollResults to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
export default AbstractPollResults(PollResults);
