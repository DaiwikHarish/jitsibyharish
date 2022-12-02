import React from "react";
import { RingLoader } from "react-spinners";

const UrlValidation = (props: any) => {
    return (
        <div className={props.class}>
                <div
                    style={{
                        margin: "auto",
                        width: "25%",
                        height: "25%",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        alignItems: "center",
                        display: "block",
                        padding: '20px',
                        boxSizing: "border-box",
                        overflow: "auto",
                        outline: 0,
                        minHeight: "inherit",
                        maxHeight: "inherit",
                    }}
                >
                    <h2
                        style={{
                            // margin: "auto",
                            textAlign: "center",
                            padding: "10px",
                            color: "red",
                            fontWeight:"bold",
                            fontFamily:"sans-serif"
                        }}
                    >
                        {props.title}
                    </h2>
                    <h3
                        style={{
                            color: "#000000de",
                            margin: "auto",
                            textAlign: "center",
                            marginTop: "25px",
                            fontFamily:"sans-serif",
                            fontWeight:"lighter"
                        }}
                    >
                        {props.message}
                    </h3>
                   
                        {/* <div
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
                        </div> */}
                    
                </div>
        </div>
    );
};

export default UrlValidation;
