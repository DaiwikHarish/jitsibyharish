import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { withTheme } from 'react-native-paper';

import { Avatar } from '../../../base/avatar';
import { BottomSheet, hideSheet } from '../../../base/dialog';
import { bottomSheetStyles } from '../../../base/dialog/components/native/styles';
import { translate } from '../../../base/i18n';
import { IconArrowDownLarge, IconArrowUpLarge } from '../../../base/icons';
import { getParticipantDisplayName } from '../../../base/participants';
import { BaseIndicator } from '../../../base/react';
import { connect } from '../../../base/redux';
import statsEmitter from '../../../connection-indicator/statsEmitter';

import styles from './styles';

/**
 * Size of the rendered avatar in the menu.
 */
const AVATAR_SIZE = 25;

const CONNECTION_QUALITY = [
    'Low',
    'Medium',
    'Good'
];

export type Props = {

    /**
     * The Redux dispatch function.
     */
    dispatch: Function,

    /**
     * The ID of the participant that this button is supposed to pin.
     */
    participantID: string,

    /**
     * True if the menu is currently open, false otherwise.
     */
    _isOpen: boolean,

    /**
     * Display name of the participant retrieved from Redux.
     */
    _participantDisplayName: string,

    /**
     * The function to be used to translate i18n labels.
     */
    t: Function,

    /**
     * Theme used for styles.
     */
    theme: Object
}

/**
 * The type of the React {@code Component} state of {@link ConnectionStatusComponent}.
 */
type State = {
    resolutionString: string,
    downloadString: string,
    uploadString: string,
    packetLostDownloadString: string,
    packetLostUploadString: string,
    serverRegionString: string,
    codecString: string,
    connectionString: string
};

/**
 * Class to implement a popup menu that show the connection statistics.
 */
class ConnectionStatusComponent extends Component<Props, State> {

    /**
     * Constructor of the component.
     *
     * @param {P} props - The read-only properties with which the new
     * instance is to be initialized.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._onStatsUpdated = this._onStatsUpdated.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._renderMenuHeader = this._renderMenuHeader.bind(this);

        this.state = {
            resolutionString: 'N/A',
            downloadString: 'N/A',
            uploadString: 'N/A',
            packetLostDownloadString: 'N/A',
            packetLostUploadString: 'N/A',
            serverRegionString: 'N/A',
            codecString: 'N/A',
            connectionString: 'N/A'
        };
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactNode}
     */
    render() {
        const { t, theme } = this.props;
        const { palette } = theme;

        return (
            <BottomSheet
                onCancel = { this._onCancel }
                renderHeader = { this._renderMenuHeader }>
                <View style = { styles.statsWrapper }>
                    <View style = { styles.statsInfoCell }>
                        <Text style = { styles.statsTitleText }>
                            { `${t('connectionindicator.status')} ` }
                        </Text>
                        <Text style = { styles.statsInfoText }>
                            { this.state.connectionString }
                        </Text>
                    </View>
                    <View style = { styles.statsInfoCell }>
                        <Text style = { styles.statsTitleText }>
                            { `${t('connectionindicator.bitrate')}` }
                        </Text>
                        <BaseIndicator
                            icon = { IconArrowDownLarge }
                            iconStyle = {{
                                color: palette.icon03
                            }} />
                        <Text style = { styles.statsInfoText }>
                            { this.state.downloadString }
                        </Text>
                        <BaseIndicator
                            icon = { IconArrowUpLarge }
                            iconStyle = {{
                                color: palette.icon03
                            }} />
                        <Text style = { styles.statsInfoText }>
                            { `${this.state.uploadString} Kbps` }
                        </Text>
                    </View>
                    <View style = { styles.statsInfoCell }>
                        <Text style = { styles.statsTitleText }>
                            { `${t('connectionindicator.packetloss')}` }
                        </Text>
                        <BaseIndicator
                            icon = { IconArrowDownLarge }
                            iconStyle = {{
                                color: palette.icon03
                            }} />
                        <Text style = { styles.statsInfoText }>
                            { this.state.packetLostDownloadString }
                        </Text>
                        <BaseIndicator
                            icon = { IconArrowUpLarge }
                            iconStyle = {{
                                color: palette.icon03
                            }} />
                        <Text style = { styles.statsInfoText }>
                            { this.state.packetLostUploadString }
                        </Text>
                    </View>
                    <View style = { styles.statsInfoCell }>
                        <Text style = { styles.statsTitleText }>
                            { `${t('connectionindicator.resolution')} ` }
                        </Text>
                        <Text style = { styles.statsInfoText }>
                            { this.state.resolutionString }
                        </Text>
                    </View>
                    <View style = { styles.statsInfoCell }>
                        <Text style = { styles.statsTitleText }>
                            { `${t('connectionindicator.codecs')}` }
                        </Text>
                        <Text style = { styles.statsInfoText }>
                            { this.state.codecString }
                        </Text>
                    </View>
                </View>
            </BottomSheet>
        );
    }

    /**
     * Starts listening for stat updates.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidMount() {
        statsEmitter.subscribeToClientStats(this.props.participantID, this._onStatsUpdated);
    }

    /**
     * Updates which user's stats are being listened to.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidUpdate(prevProps: Props) {
        if (prevProps.participantID !== this.props.participantID) {
            statsEmitter.unsubscribeToClientStats(
                prevProps.participantID, this._onStatsUpdated);
            statsEmitter.subscribeToClientStats(
                this.props.participantID, this._onStatsUpdated);
        }
    }

    _onStatsUpdated: Object => void;

    /**
     * Callback invoked when new connection stats associated with the passed in
     * user ID are available. Will update the component's display of current
     * statistics.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {void}
     */
    _onStatsUpdated(stats = {}) {
        const newState = this._buildState(stats);

        this.setState(newState);
    }

    /**
     * Extracts statistics and builds the state object.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {State}
     */
    _buildState(stats) {
        const { download: downloadBitrate, upload: uploadBitrate } = this._extractBitrate(stats) ?? {};

        const { download: downloadPacketLost, upload: uploadPacketLost } = this._extractPacketLost(stats) ?? {};

        return {
            resolutionString: this._extractResolutionString(stats) ?? this.state.resolutionString,
            downloadString: downloadBitrate ?? this.state.downloadString,
            uploadString: uploadBitrate ?? this.state.uploadString,
            packetLostDownloadString: downloadPacketLost === undefined
                ? this.state.packetLostDownloadString : `${downloadPacketLost}%`,
            packetLostUploadString: uploadPacketLost === undefined
                ? this.state.packetLostUploadString : `${uploadPacketLost}%`,
            serverRegionString: this._extractServer(stats) ?? this.state.serverRegionString,
            codecString: this._extractCodecs(stats) ?? this.state.codecString,
            connectionString: this._extractConnection(stats) ?? this.state.connectionString
        };
    }

    /**
     * Extracts the resolution and framerate.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {string}
     */
    _extractResolutionString(stats) {
        const { framerate, resolution } = stats;

        const resolutionString = Object.keys(resolution || {})
            .map(ssrc => {
                const { width, height } = resolution[ssrc];

                return `${width}x${height}`;
            })
            .join(', ') || null;

        const frameRateString = Object.keys(framerate || {})
            .map(ssrc => framerate[ssrc])
            .join(', ') || null;

        return resolutionString && frameRateString ? `${resolutionString}@${frameRateString}fps` : undefined;
    }

    /**
     * Extracts the download and upload bitrates.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {{ download, upload }}
     */
    _extractBitrate(stats) {
        return stats.bitrate;
    }

    /**
     * Extracts the download and upload packet lost.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {{ download, upload }}
     */
    _extractPacketLost(stats) {
        return stats.packetLoss;
    }

    /**
     * Extracts the server name.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {string}
     */
    _extractServer(stats) {
        return stats.serverRegion;
    }

    /**
     * Extracts the audio and video codecs names.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {string}
     */
    _extractCodecs(stats) {
        const { codec } = stats;

        let codecString;

        if (codec) {
            const audioCodecs = Object.values(codec)
                .map(c => c.audio)
                .filter(Boolean);
            const videoCodecs = Object.values(codec)
                .map(c => c.video)
                .filter(Boolean);

            if (audioCodecs.length || videoCodecs.length) {
                // Use a Set to eliminate duplicates.
                codecString = Array.from(new Set([ ...audioCodecs, ...videoCodecs ])).join(', ');
            }
        }

        return codecString;
    }

    /**
     * Extracts the connection percentage and sets connection quality.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {string}
     */
    _extractConnection(stats) {
        const { connectionQuality } = stats;

        if (connectionQuality) {
            const signalLevel = Math.floor(connectionQuality / 33.4);

            return CONNECTION_QUALITY[signalLevel];
        }
    }

    /**
     * Callback to hide the {@code ConnectionStatusComponent}.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {
        statsEmitter.unsubscribeToClientStats(this.props.participantID, this._onStatsUpdated);

        this.props.dispatch(hideSheet());
    }

    /**
     * Function to render the menu's header.
     *
     * @returns {React$Element}
     */
    _renderMenuHeader() {
        const { participantID } = this.props;

        return (
            <View
                style = { [
                    bottomSheetStyles.sheet,
                    styles.participantNameContainer ] }>
                <Avatar
                    participantId = { participantID }
                    size = { AVATAR_SIZE } />
                <Text style = { styles.participantNameLabel }>
                    { this.props._participantDisplayName }
                </Text>
            </View>
        );
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state, ownProps) {
    const { participantID } = ownProps;

    return {
        _participantDisplayName: getParticipantDisplayName(state, participantID)
    };
}

export default translate(connect(_mapStateToProps)(withTheme(ConnectionStatusComponent)));
