/* eslint-disable lines-around-comment */
import { Theme } from "@mui/material";
import React, { useEffect } from "react";
import { ReactNode } from "react";
import { makeStyles } from "tss-react/mui";

import { IReduxState } from "../../../../app/types";
import DeviceStatus from "../../../../prejoin/components/web/preview/DeviceStatus";
// @ts-ignore
import { Toolbox } from "../../../../toolbox/components/web";
import { IAttendeeInfo, IMeetingInfo, IUrlInfo } from "../../../app/types";
import { getConferenceName } from "../../../conference/functions";
import {
    PREMEETING_BUTTONS,
    THIRD_PARTY_PREJOIN_BUTTONS,
} from "../../../config/constants";
import {
    getToolbarButtons,
    isToolbarButtonEnabled,
} from "../../../config/functions.web";
import MeetingValidation from "../../../post-welcome-page/meeting-validation";
import UrlValidation from "../../../post-welcome-page/url-validation";
import { connect } from "../../../redux/functions";
import { withPixelLineHeight } from "../../../styles/functions.web";

import ConnectionStatus from "./ConnectionStatus";
// @ts-ignore
import Preview from "./Preview";

interface IProps {
    loading: boolean;
    clickStartBtn: boolean;

    _urlInfo: IUrlInfo;

    _attendeeInfo: IAttendeeInfo;

    _meetingInfo: IMeetingInfo;

    /**
     * The list of toolbar buttons to render.
     */
    _buttons: Array<string>;

    /**
     * The branding background of the premeeting screen(lobby/prejoin).
     */
    _premeetingBackground: string;

    /**
     * The name of the meeting that is about to be joined.
     */
    _roomName: string;

    /**
     * Children component(s) to be rendered on the screen.
     */
    children?: ReactNode;

    /**
     * Additional CSS class names to set on the icon container.
     */
    className?: string;

    /**
     * The name of the participant.
     */
    name?: string;

    /**
     * Indicates whether the copy url button should be shown.
     */
    showCopyUrlButton: boolean;

    /**
     * Indicates whether the device status should be shown.
     */
    showDeviceStatus: boolean;

    /**
     * The 'Skip prejoin' button to be rendered (if any).
     */
    skipPrejoinButton?: ReactNode;

    /**
     * Whether it's used in the 3rdParty prejoin screen or not.
     */
    thirdParty?: boolean;

    /**
     * Title of the screen.
     */
    title?: string;

    /**
     * True if the preview overlay should be muted, false otherwise.
     */
    videoMuted?: boolean;

    /**
     * The video track to render as preview (if omitted, the default local track will be rendered).
     */
    videoTrack?: Object;
}

const useStyles = makeStyles()((theme: Theme) => {
    return {
        subtitle: {
            ...withPixelLineHeight(theme.typography.heading5),
            color: theme.palette.text01,
            marginBottom: theme.spacing(4),
            overflow: "hidden",
            textAlign: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
        },
    };
});

const PreMeetingScreen = ({
    _buttons,
    _premeetingBackground,
    _roomName,
    children,
    className,
    showDeviceStatus,
    skipPrejoinButton,
    title,
    videoMuted,
    videoTrack,
    _attendeeInfo,
    _meetingInfo,
    clickStartBtn,
    _urlInfo,
    loading,
}: IProps) => {
    const { classes } = useStyles();
    const containerClassName = `premeeting-screen ${
        className ? className : ""
    }`;
    const style = _premeetingBackground
        ? {
              background: _premeetingBackground,
              backgroundPosition: "center",
              backgroundSize: "cover",
          }
        : {};

    return _urlInfo.meetingId === null ||
        _urlInfo.meetingId === undefined ||
        _urlInfo.meetingId === "" ||
        _urlInfo.meetingId === '' ||
        _urlInfo.userId === null ||
        _urlInfo.userId === undefined ||
        _urlInfo.userId === "" ||
        _urlInfo.userId === '' ? (
        <UrlValidation
            class={containerClassName}
            title={"Empty Inputs"}
            message={"Please enter meeting id and user id. Then try."}
        />
    ) :  _meetingInfo !== undefined && _attendeeInfo === undefined ? (
        <MeetingValidation
            class={containerClassName}
            title={"Invalid User"}
            message={"Please enter a valid user id. Then try."}
            loading={loading}
        />
    ) : _meetingInfo === undefined && _attendeeInfo === undefined ? (
        <MeetingValidation
            class={containerClassName}
            title={"Not Found"}
            message={"Meeting and user does not exist"}
            loading={loading}
        />
    ) : _attendeeInfo !== undefined && _attendeeInfo.isAllowed == false ? (
        <MeetingValidation
            class={containerClassName}
            title={"Not Allowed"}
            message={"User is not allowed to join the conference"}
            loading={loading}
        />
    ) : (
        <div className={containerClassName}>
            <div style={style}>
                <div className="content">
                    {clickStartBtn && <ConnectionStatus />}

                    <div className="content-controls">
                        <h1 className="title">
                            {clickStartBtn == false
                                ? "Choose An Option"
                                : title}
                        </h1>

                        <span className={classes.subtitle}>
                            {_meetingInfo?.name}
                        </span>

                        {children}
                        {clickStartBtn && _buttons.length && (
                            <Toolbox toolbarButtons={_buttons} />
                        )}
                        {skipPrejoinButton}
                        {clickStartBtn && showDeviceStatus && <DeviceStatus />}
                    </div>
                </div>
            </div>
            <Preview
                videoMuted={videoMuted}
                videoTrack={videoTrack}
                clickStartBtn={clickStartBtn}
            />
        </div>
    );
};

/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The props passed to the component.
 * @returns {Object}
 */
function mapStateToProps(state: IReduxState, ownProps: Partial<IProps>) {
    const { hiddenPremeetingButtons, hideConferenceSubject } =
        state["features/base/config"];
    const toolbarButtons = getToolbarButtons(state);
    const premeetingButtons = (
        ownProps.thirdParty ? THIRD_PARTY_PREJOIN_BUTTONS : PREMEETING_BUTTONS
    ).filter((b: any) => !(hiddenPremeetingButtons || []).includes(b));

    const { premeetingBackground } = state["features/dynamic-branding"];

    return {
        // For keeping backwards compat.: if we pass an empty hiddenPremeetingButtons
        // array through external api, we have all prejoin buttons present on premeeting
        // screen regardless of passed values into toolbarButtons config overwrite.
        // If hiddenPremeetingButtons is missing, we hide the buttons according to
        // toolbarButtons config overwrite.
        _buttons: hiddenPremeetingButtons
            ? premeetingButtons
            : premeetingButtons.filter((b) =>
                  isToolbarButtonEnabled(b, toolbarButtons)
              ),
        _premeetingBackground: premeetingBackground,
        _roomName: hideConferenceSubject ? undefined : getConferenceName(state),
        _meetingInfo: state["features/base/app"].meetingInfo,
        _attendeeInfo: state["features/base/app"].attendeeInfo,
        _urlInfo: state["features/base/app"].urlInfo,
    };
}

export default connect(mapStateToProps)(PreMeetingScreen);
