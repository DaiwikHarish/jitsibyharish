import React from "react";
import { RingLoader } from "react-spinners";

const MeetingValidation = (props: any) => {
    return (
        <div className={props.class}>
            {props.loading === true ? (
                <div
                    style={{
                        margin: "auto",
                        width: "25%",
                        height: "30%",
                        backgroundColor: "#292929",
                        borderRadius: "7px",
                        alignItems: "center",
                    }}
                >
                    <RingLoader
                        cssOverride={{
                            margin: "auto",
                            width: "25%",
                            height: "30%",
                        }}
                        color={"white"}
                        loading={props.loading}
                    />
                </div>
            ) : (
                <div
                    style={{
                        margin: "auto",
                        width: "25%",
                        height: "30%",
                        backgroundColor: "white",
                        borderRadius: "7px",
                        alignItems: "center",
                    }}
                >
                    <h2
                        style={{
                            margin: "auto",
                            textAlign: "center",
                            padding: "10px",
                            color: "red",
                            fontWeight:"bold"
                        }}
                    >
                        {props.title}
                    </h2>
                    <h3
                        style={{
                            color: "blueviolet",
                            margin: "auto",
                            textAlign: "center",
                            marginTop: "25px",
                        }}
                    >
                        {props.message}
                    </h3>
                   
                        <div
                            onClick={() => {}}
                            role={"button"}
                            style={{
                                width: "40%",
                                backgroundColor: "#16A5E1",
                                padding: "10",
                                // borderColor: "slateblue",
                                margin: "auto",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "white",
                                textAlign: "center",
                                borderRadius: "10px",
                                marginTop: "50px",
                                // margin:"auto",
                                alignSelf: "center",
                                // bottom:10,
                                // position:"fixed",
                                boxSizing: "border-box",
                            }}
                        >
                            Okay
                        </div>
                    
                </div>
            )}
        </div>
    );
};

export default MeetingValidation;
