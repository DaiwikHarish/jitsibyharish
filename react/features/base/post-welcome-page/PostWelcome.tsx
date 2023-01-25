import React, { Component } from "react";
import { IReduxState } from "../../app/types";
import {appClientType} from "../app/actions";
import { OptionType } from "../app/reducer";
import { IAttendeeInfo, IMeetingInfo, IUrlInfo} from "../app/types";
import { connect } from "../redux/functions";
const mapDispatchToProps = (dispatch: any) => {
    return {
        updateClientType: (clientType: string) => {
            dispatch(appClientType(clientType));
        }
    };
};

const mapStateToProps = (state: IReduxState) => {
    return {
        _clientType: state["features/base/app"].clientType,
        _urlInfo: state["features/base/app"].urlInfo,
        _storeMeetingInfo: state["features/base/app"].meetingInfo,
        _storeAttendeeInfo: state["features/base/app"].attendeeInfo
    };
};

type Props = {
    onStart?: any;
    _clientType: string;
    _urlInfo: IUrlInfo;
    _storeMeetingInfo: IMeetingInfo,
    _storeAttendeeInfo: IAttendeeInfo
};

export class PostWelcome extends Component<Props> {
    constructor(props: any) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
    }

    onValueChange(event: any) {
        //@ts-ignore
        this.props.updateClientType(event.target.value);
    }

    componentDidMount() {
        //@ts-ignore
        this.props.updateClientType(OptionType.ENABLE_ALL);  
    }

    render() {
        const { onStart } = this.props;
        return (
            <div
                style={{
                    flex: 1,
                    backgroundColor: '#292929',
                    alignContent: "flex-start",
                    alignItems: "center",
                    // paddingTop: "2%",
                    marginBottom:"10px",
                }}
            >
                <div
                    role={"button"}
                    style={{
                        width: "100%",
                        // backgroundColor: "#292929",
                        padding: "10px",
                        margin: "auto",
                        marginBottom: "5px",
                        display: "flex",
                        flexDirection: "row",
                        // justifyContent:"space-between",
                        justifyContent: "center",
                        alignItems: "center",
                        boxSizing: "border-box",
                    }}
                >
                    <input
                        style={{ width: "30px", height: "30px" }}
                        type="radio"
                        value={OptionType.ENABLE_ALL}
                        checked={
                            this.props?._clientType === OptionType.ENABLE_ALL
                        }
                        onChange={this.onValueChange}
                    />
                    <div
                        style={{
                            width: "90%",
                            backgroundColor: "dodgerblue",
                            padding: "10px",
                            borderColor: "slateblue",
                            margin: "auto",
                            marginLeft: "10px",
                            fontSize: "14px",
                            fontWeight: 600,
                            borderRadius: "10px",
                            textAlign: "center",
                            color: "white",
                            boxSizing: "border-box",
                        }}
                    >
                        Join the Lecture
                    </div>
                </div>

                <div
                    role={"button"}
                    style={{
                        width: "100%",
                        // backgroundColor: "white",
                        padding: "10px",
                        margin: "auto",
                        marginBottom: "5px",
                        display: "flex",
                        flexDirection: "row",
                        // justifyContent:"space-between",
                        justifyContent: "center",
                        alignItems: "center",
                        boxSizing: "border-box",
                    }}
                >
                    <input
                        style={{ width: "30px", height: "30px" }}
                        type="radio"
                        value={OptionType.ENABLE_CHAT_POLL}
                        checked={
                            this.props?._clientType ===
                            OptionType.ENABLE_CHAT_POLL
                        }
                        onChange={this.onValueChange}
                    />
                    <div
                        style={{
                            width: "90%",
                            backgroundColor: "dodgerblue",
                            padding: "10px",
                            borderColor: "slateblue",
                            margin: "auto",
                            marginLeft: "10px",
                            fontSize: "14px",
                            fontWeight: 600,
                            borderRadius: "10px",
                            textAlign: "center",
                            color: "white",
                            boxSizing: "border-box",
                        }}
                    >
                        Polling & Chat
                    </div>
                </div>
                <button
                    onClick={onStart}
                    role={"button"}
                    style={{
                        width: "50%",
                        backgroundColor: "#A865C9",
                        padding: "10",
                        borderColor: "slateblue",
                        margin: "auto",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "white",
                        textAlign: "center",
                        borderRadius: "10px",
                        marginTop: "30px",
                        // marginLeft:"5px",
                        boxSizing: "border-box",
                    }}
                >
                    Start
                </button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostWelcome);