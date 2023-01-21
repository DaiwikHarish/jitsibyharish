import { Button } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Input from "../base/ui/components/web/Input";
// @ts-ignore
import { Icon, IconTrash } from "../base/icons";
import { ApiConstants } from '../../../ApiConstants';
import { ApplicationConstants } from '../../../ApplicationConstants';
import Poll from "./poll";
import { RingLoader } from "react-spinners";

interface IpollProps {
    
    showpollid?: number;
   
}

const editPoll = ({
    showpollid
}: IpollProps) => {

    const [createPollState, setcreatePollState] = useState(true);
    const [showPollState, setshowPollState] = useState(false);
    const [loading, setLoading] = useState(false);
    const [PollQtnList, setPollQtnList] = useState([
        {
           
            question: "",
            createdUserId: ApplicationConstants.userId,
            updatedUserId: ApplicationConstants.userId,
            meetingId: ApplicationConstants.meetingId,
            groupId: showpollid,
            operation:"Update",
            isAnswerTypeSingle: true,
            displaySeqNr: 1,
            answerOptions: [
              {
                  answerLabel: "1",
                  answerOption: "",
                  displaySeqNr: 1,
                    operation:"Update",
                  createdUserId: ApplicationConstants.userId,
            updatedUserId: ApplicationConstants.userId,
                  isCorrect: false,
              },
             
          ],
          
        },
    ]);

    
   // const [PollQtnList, setPollQtnList] = useState(poll);

    const [pollTitle, setpollTitle] = useState("");
   
    useEffect(() => {
        getSeletecdpoll(showpollid);
    }, []);
    function getSeletecdpoll(id:any) {
      
        setLoading(true)
                fetch(
                    ApiConstants.poll +
                        '?groupId=' +
                        id 
                )
                    .then((response) => response.json())
                    .then((selected) => {
                      
                        const list = [...selected.data];

                          list.map((listQtn:any, index:any) => {


                          let answerOptions=  listQtn.answerOptions.map((listans:any, indexans:any) => {
                            
                                      return {
                                   ...listans,
                                   "operation":"Update"
                                };
                                
                            })

                            list[index]["answerOptions"]=answerOptions;

                          list[index]["operation"] = "Update"
                          
                    
                    })
                      


               

list.map((listQtn:any, index:any) => {


    let answerOptions=  listQtn.answerOptions.map((listans:any, indexans:any) => {
      
                return {
             ...listans,
             "operation":"Update"
          };
          
      })

      list[index]["answerOptions"]=answerOptions;

    list[index]["operation"] = "Update"
    

})


                        setPollQtnList(list)

                        setpollTitle(selected.data[0].groupName)
                        
                        setLoading(false)
                    });
          
    }
    const handlePollQtnChange = (e:any, index:any) => {
        e.preventDefault(); 
        const { name, value } = e.target;
        const list:any = [...PollQtnList];

        list[index][name] = value;
        setPollQtnList(list);
    };

    const handlePollAnsChange = (e:any, index:any, indexAns:any) => {
        e.preventDefault(); 
        const { name, value } = e.target;

        const list = [...PollQtnList];
      
        const PollAnslist = [...list[index]["answerOptions"]];
        console.log(indexAns)
        PollAnslist[indexAns]["answerOption"] = value;
        console.log(PollAnslist[indexAns]["answerOption"])
        list[index]["answerOptions"] = PollAnslist;
     
        setPollQtnList(list);
    
    };
    const handlePollAnslableChange = (e:any, index:any, indexAns:any) => {
        e.preventDefault(); 
        const { name, value } = e.target;

        const list = [...PollQtnList];

        const PollAnslist = [...list[index]["answerOptions"]];

        PollAnslist[indexAns]["answerLabel"] = value;

        list[index]["answerOptions"] = PollAnslist;

        setPollQtnList(list);
    };
    

    const handlePollSelectChange = (e:any, index:any) => {
        const { name, value } = e.target;
        const list = [...PollQtnList];

        list[index]["isAnswerTypeSingle"] = value == "Single" ? true : false;


        const PollAnslist = [...list[index]["answerOptions"]];

        if(list[index]["isAnswerTypeSingle"]==true)
        {
            PollAnslist.map((listQtn:any, indexinside:any) => {
            PollAnslist[indexinside]["isCorrect"] = false
            })
        }

        list[index]["answerOptions"] = PollAnslist;


        setPollQtnList(list);
    };

    const handlePollQtnRemove = (index:any) => {
        const list = [...PollQtnList];
        

        if(list[index]["operation"]=="Add")
{
    list.splice(index, 1);
}
else{
    list[index]["operation"]="Remove";
}
        //list.splice(index, 1);

        
        setPollQtnList(list);
    };
    const handlePollAnsRemove = (index:any, indexAns:any) => {
        const list = [...PollQtnList];
        console.log("core list...")


        const PollAnslist = [...list[index]["answerOptions"]];
        console.log(PollAnslist)
if(PollAnslist[indexAns]["operation"]=="Add")
{
    PollAnslist.splice(indexAns, 1);
}else{
    PollAnslist[indexAns]["operation"]="Remove";
}
        
       // PollAnslist.splice(indexAns, 1);
        list[index]["answerOptions"] = PollAnslist;
// console.log(PollAnslist)
 console.log(indexAns)
       console.log( PollAnslist.filter( element => element.operation !="Remove").length)
      console.log("Remove list...")
        console.log(PollAnslist)
        setPollQtnList(list);
    };

    const handlePollQtnAdd = () => {
        const list = [...PollQtnList];
        let index=list[list.length-1].displaySeqNr
        setPollQtnList([
            ...PollQtnList,
            {
                
              question: "",
              createdUserId: ApplicationConstants.userId,
              updatedUserId: ApplicationConstants.userId,
              meetingId: ApplicationConstants.meetingId,
              groupId: showpollid,
              operation
              : 
              "Add",
              isAnswerTypeSingle: true,
              displaySeqNr: index+1,
              answerOptions: [
                {
                    answerLabel: "1",
                    answerOption: "",
                    displaySeqNr: 1,
                    operation:"Add",
                    createdUserId: ApplicationConstants.userId,
              updatedUserId: ApplicationConstants.userId,
                    isCorrect: false,
                    
                },
               
            ],
            },
        ]);
    };

    const handlePollSave = () => {



        if(pollTitle!="")
        {
            const list:any= [...PollQtnList];
        let valid=0
        
            list.map((listQtn:any, index:any) => {
        
                if(listQtn.question.trim()=="" || listQtn.question==null)
                {
        
                list[index]["questionNull"] =true
                valid=1
                }
               
                const PollAnslist = [...list[index]["answerOptions"]];
               
                listQtn.answerOptions.map((answerOpt:any, indexans:any) => {
        
                    if(answerOpt.answerOption.trim()=="" || answerOpt.answerOption==null)
                    {
            
                        PollAnslist[indexans]["answerNull"] =true
                    valid=1
                    }
                    list[index]["answerOptions"] = PollAnslist;
                })
        
            })

            if(valid==0)
            {

                setLoading(true)

      const PATCHGroupMethod = {
        method: 'PATCH', // Method itself
        headers: {
            'Content-type': 'application/json; charset=UTF-8', // Indicates the content
        },
        body: JSON.stringify({  id:showpollid, name: pollTitle, meetingId:  ApplicationConstants.meetingId, updatedUserId:  ApplicationConstants.userId}),
    };

      fetch(ApiConstants.pollGroup+"/id="+  showpollid, PATCHGroupMethod)
      .then((response) => response.json())
      .then((data) => {

     // setgroupId(data.id)


      const list:any = [...PollQtnList];

      list.map((listQtn:any, index:any) => (

        delete list[index]["images"] 
        

      ))

      list.map((listQtn:any, index:any) => (

        delete list[index]["questionNull"] 
        

      ))
      list.map((listQtn:any, index:any) => (

        list[index]["displaySeqNr"] = index+1
  
        ))
      list.map((listQtn:any, index:any) => {
        const PollAnslist:any = [...list[index]["answerOptions"]];
       
        listQtn.answerOptions.map((answerOpt:any, indexans:any) => (
  
          delete   PollAnslist[indexans]["answerNull"]  
            
        ))
        listQtn.answerOptions.map((answerOpt:any, indexans:any) => (
  
          PollAnslist[indexans]["displaySeqNr"] = indexans+1
        ))
       
      //   listQtn.answerOptions.map((answerOpt, indexans) => (
  
      //     PollAnslist[indexans]["answerLabel"] = String(indexans+1)
      //   ))
  
  
        list[index]["answerOptions"] = PollAnslist;
      })
       
          
  
        



      const PATCHMethod = {
        method: 'PATCH', // Method itself
        headers: {
            'Content-type': 'application/json; charset=UTF-8', // Indicates the content
        },
        body: JSON.stringify({
          pollQuestion: list
        }),
    };

    // make the HTTP put request using fetch api

    fetch(ApiConstants.poll, PATCHMethod)
        .then((response) => response.json())
        .then((data) => {
            setshowPollState(true)
            setLoading(false)
          setcreatePollState(false)

        });
      });

      
    }else{
        setPollQtnList(list);
    }
}
    
    
    else{
        var pollTitleinput = document.getElementById('pollTitle') as HTMLElement;
        pollTitleinput.style.border = '2px solid red';
    }
    }
    const handlePollAnscheckChange = (index:any, indexAns:any) => {


       
        const list = [...PollQtnList];

        const PollAnslist = [...list[index]["answerOptions"]];

        if(list[index]["isAnswerTypeSingle"]==true)
        {
            PollAnslist.map((listQtn:any, indexinside:any) => {
            PollAnslist[indexinside]["isCorrect"] = false
            })
        }

        list[index]["answerOptions"] = PollAnslist;

if(PollAnslist[indexAns]["isCorrect"]==true)
{
    PollAnslist[indexAns]["isCorrect"] = false
}else{
    PollAnslist[indexAns]["isCorrect"] = true
}
       
        list[index]["answerOptions"] = PollAnslist;

        setPollQtnList(list);
    };

    
    const handlePollOptionAdd = (index:any) => {
    
        const list:any = [...PollQtnList];

      //  let indexAns= list[index]["answerOptions"].filter( element => element.operation !="Remove").length

        let indexAns=list[index]["answerOptions"][list[index]["answerOptions"].length-1].displaySeqNr
        console.log("Add list...")
       
        const PollAnslist = [
            ...list[index]["answerOptions"],
            { 
              
              
              answerLabel: indexAns + 1, 
          
              operation:"Add",
            answerOption: "",
            displaySeqNr: indexAns + 1,
            createdUserId: ApplicationConstants.userId,
            updatedUserId: ApplicationConstants.userId,
            isCorrect: false,
            pollQuestionId:list[index]["id"],
          },
        ];

        list[index]["answerOptions"] = PollAnslist as any;


       console.log( PollAnslist.filter( element => element.operation !="Remove").length)
       console.log("PollAnslist...")
       console.log( PollAnslist.filter( element => element.operation !="Remove"))
        setPollQtnList(list);
    };

    return (

<>      {  createPollState ?

        <div style={{ padding: 20 }}>
          {!loading ?        <div className="form-field">
                <h3 style={{ fontSize: 18 }}>Poll Title:</h3>
                <Input
                    type="text"
                    textarea={true}
                    value={pollTitle}
                    onChange={(val) => setpollTitle(val)}
                    
                    name="pollTitle"
                    className="inputBox"
                    placeholder="Enter Poll Title"
                />
                {PollQtnList.map((singlePollQtn:any, index:any) => (


singlePollQtn.operation!='Remove'?
                    <div
                        key={index}
                        className="PollQtns"
                        style={{ marginBottom: 50 }}
                    >
                        <div className="first-division">
                            <div
                                className="poll-answer"
                                style={{ margin: "36px 1px" }}
                            >
                                <div className="poll-header">
                                    <div
                                        className="poll-question"
                                        style={{ fontSize: 16 }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: 16,
                                                marginBottom: 5,
                                            }}
                                        >
                                            Poll Question {index + 1} :
                                        </h3>
                                        <div style={{ display: "flex" }}>
                                            <textarea
                                                placeholder="Enter Question"
                                                style={{
                                                    background: "#3D3D3D",
                                                    color: "#FFF",
                                                    fontSize: "16px",
                                                    lineHeight: "20px",
                                                    fontWeight: "400",
                                                    letterSpacing: "0",
                                                    padding: "10px 16px",
                                                    borderRadius: "6px",
                                                    border: singlePollQtn.questionNull?"1px solid red":"1px solid rgb(204, 204, 204)",
                                                 
                                                    height: "65px",
                                                    boxSizing: "border-box",
                                                    width: "70%",
                                                }}
                                                
                                                id="question"
                                                name="question"
                                                value={
                                                    singlePollQtn.question
                                                }
                                                onChange={(e) =>
                                                    handlePollQtnChange(
                                                        e,
                                                        index
                                                    )
                                                }
                                            />

                                            <select
                                                style={{
                                                    background: "#3D3D3D",
                                                    color: "#FFF",
                                                    fontSize: "16px",
                                                    lineHeight: "20px",
                                                    fontWeight: "400",
                                                    letterSpacing: "0",
                                                    padding: "10px 16px",
                                                    borderRadius: "6px",
                                                    border: "1px solid rgb(204, 204, 204)",
                                                    height: "50px",
                                                    boxSizing: "border-box",
                                                    marginLeft: "3%",
                                                    width: "27%",
                                                }}
                                                name="Selection"
                                                id="Selection"
                                                onChange={(e) =>
                                                    handlePollSelectChange(
                                                        e,
                                                        index
                                                    )
                                                }
                                            >
                                                <option value="Single" selected={singlePollQtn.isAnswerTypeSingle?true:false}>
                                                    Single Selection
                                                </option>
                                                <option value="Multiple" selected={singlePollQtn.isAnswerTypeSingle?false:true}>
                                                    Multiple Selection
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <ol className="poll-answer-list">
                                    {singlePollQtn.answerOptions.map(
                                        (answerOptions:any, indexAns:any) => (
                                            answerOptions.operation!='Remove'?
                                            <>
                                                <li className="poll-answer-container">
                                                    <div className="pollFormControl" style={{width:'100%'}}>
                                                        <div className="pollActiveArea" >
                                                            <input
                                                                className={
                                                                    singlePollQtn.isAnswerTypeSingle
                                                                        ? "pollRadio"
                                                                        : "pollcheckbox"
                                                                }
                                                                type={ singlePollQtn.isAnswerTypeSingle?'Radio':'checkbox'}
                                                            />
                                                            <div onClick={(e) =>
                                                                    handlePollAnscheckChange(
                                                                      
                                                                        index,
                                                                        indexAns
                                                                    )
                                                                } style={{opacity:answerOptions.isCorrect?1:0}}  className="jitsi-icon pollActiveAreacheckmark">
                                                                <svg
                                                                    fill="none"
                                                                    height="18"
                                                                    width="18"
                                                                    viewBox="0 0 18 18"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z"
                                                                        fill="currentColor"
                                                                        stroke="currentColor"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        <div style={{width:'100%'}}>
                                                            <textarea
                                                                placeholder="Lable"
                                                                style={{
                                                                    background:
                                                                        "#3D3D3D",
                                                                    color: "#FFF",
                                                                    fontSize:
                                                                        "14px",
                                                                    lineHeight:
                                                                        "20px",
                                                                    fontWeight:
                                                                        "400",
                                                                    letterSpacing:
                                                                        "0",
                                                                    padding:
                                                                        "10px 16px",
                                                                    borderRadius:
                                                                        "6px",
                                                                    border: "1px solid #ccc",
                                                                    height: "40px",
                                                                    boxSizing:
                                                                        "border-box",
                                                                    width: "10%",
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                              
                                                                id="answerOptions"
                                                                name="answerOptions"
                                                                value={
                                                                    answerOptions.answerLabel
                                                                }
                                                                onChange={(e) =>
                                                                    handlePollAnslableChange(
                                                                        e,
                                                                        index,
                                                                        indexAns
                                                                    )
                                                                }
                                                            />
                                                            <textarea
                                                                placeholder="Enter Option"
                                                                style={{
                                                                    background:
                                                                        "#3D3D3D",
                                                                    color: "#FFF",
                                                                    fontSize:
                                                                        "14px",
                                                                    lineHeight:
                                                                        "20px",
                                                                    fontWeight:
                                                                        "400",
                                                                    letterSpacing:
                                                                        "0",
                                                                    padding:
                                                                        "10px 16px",
                                                                    borderRadius:
                                                                        "6px",
                                                                        border: answerOptions.answerNull?"1px solid red":"1px solid rgb(204, 204, 204)",
                                                                
                                                                    height: "52px",
                                                                    boxSizing:
                                                                        "border-box",
                                                                    width: "85%",
                                                                    marginLeft:
                                                                        "2%",
                                                                }}
                                                          
                                                                id="answerOptions"
                                                                name="answerOptions"
                                                                value={
                                                                    answerOptions.answerOption
                                                                }
                                                                onChange={(e) =>
                                                                    handlePollAnsChange(
                                                                        e,
                                                                        index,
                                                                        indexAns
                                                                    )
                                                                }
                                                            />{" "}
                                                        </div>

                                                        {singlePollQtn.answerOptions
                                                            .length !== 1 && (
                                                            <Button
                                                                type="button"
                                                                onClick={() =>
                                                                    handlePollAnsRemove(
                                                                        index,
                                                                        indexAns
                                                                    )
                                                                }
                                                                className="remove-btn"
                                                            >
                                                                <div
                                                                    style={{
                                                                        color: "#ff0000c2",
                                                                        display:
                                                                            "flex",
                                                                    }}
                                                                >
                                                                    <Icon
                                                                        ariaLabel="Delete"
                                                                        className="delete-meeting"
                                                                        size={
                                                                            "16"
                                                                        }
                                                                        role="button"
                                                                        style={{
                                                                            padding: 4,
                                                                        }}
                                                                        src={
                                                                            IconTrash
                                                                        }
                                                                    />
                                                                </div>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </li>
                                                {/* {singlePollQtn.answerOptions.filter( element => element.operation !="Remove").length-
                                                    1 ===
                                                    indexAns && (
                                                    <Button
                                                        type="button"
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                        // style={{"color":"#040404","borderRadius":"6px","padding":"5px 10px","display":"flex","WebkitAlignItems":"center","WebkitBoxAlign":"center","MsFlexAlign":"center","alignItems":"center","WebkitBoxPack":"center","MsFlexPack":"center","WebkitJustifyContent":"center","justifyContent":"center","border":"0","fontSize":"14px","lineHeight":"20px","fontWeight":"600","letterSpacing":"0","WebkitTransition":"background .2s","transition":"background .2s","cursor":"pointer","backgroundColor":"#E0E0E0"}}

                                                        onClick={() =>
                                                            handlePollOptionAdd(
                                                                index,
                                                                indexAns
                                                            )
                                                        }
                                                        className="add-btn"
                                                    >
                                                        <span>
                                                            + Add Option{" "}
                                                        </span>
                                                    </Button>
                                                )} */}


                                            </>:

                                            <>
                                            
                                            {/* {singlePollQtn.answerOptions.filter( element => element.operation !="Remove").length-
                                                    1 ===
                                                    indexAns && (
                                                    <Button
                                                        type="button"
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                        // style={{"color":"#040404","borderRadius":"6px","padding":"5px 10px","display":"flex","WebkitAlignItems":"center","WebkitBoxAlign":"center","MsFlexAlign":"center","alignItems":"center","WebkitBoxPack":"center","MsFlexPack":"center","WebkitJustifyContent":"center","justifyContent":"center","border":"0","fontSize":"14px","lineHeight":"20px","fontWeight":"600","letterSpacing":"0","WebkitTransition":"background .2s","transition":"background .2s","cursor":"pointer","backgroundColor":"#E0E0E0"}}

                                                        onClick={() =>
                                                            handlePollOptionAdd(
                                                                index,
                                                                indexAns
                                                            )
                                                        }
                                                        className="add-btn"
                                                    >
                                                        <span>
                                                            + Add Option{" "}
                                                        </span>
                                                    </Button>
                                                )} */}
                                            </>
                                        )
                                    )}

<Button
                                                        type="button"
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                        // style={{"color":"#040404","borderRadius":"6px","padding":"5px 10px","display":"flex","WebkitAlignItems":"center","WebkitBoxAlign":"center","MsFlexAlign":"center","alignItems":"center","WebkitBoxPack":"center","MsFlexPack":"center","WebkitJustifyContent":"center","justifyContent":"center","border":"0","fontSize":"14px","lineHeight":"20px","fontWeight":"600","letterSpacing":"0","WebkitTransition":"background .2s","transition":"background .2s","cursor":"pointer","backgroundColor":"#E0E0E0"}}

                                                        onClick={() =>
                                                            handlePollOptionAdd(
                                                                index
                                                                
                                                            )
                                                        }
                                                        className="add-btn"
                                                    >
                                                        <span>
                                                            + Add Option{" "}
                                                        </span>
                                                    </Button>
                                </ol>
                                <div className="poll-footer poll-answer-footer">
                                    <div className="second-division" style={{marginLeft:700}}>
                                        {PollQtnList.length !== 1 && (
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    handlePollQtnRemove(index)
                                                }
                                                className="remove-btn"
                                            >
                                                <div
                                                    style={{
                                                        color: "#ff0000c2",
                                                        display: "flex",
                                                    }}
                                                >
                                                    <Icon
                                                        ariaLabel="Delete"
                                                        className="delete-meeting"
                                                        color={"#ff0000c2"}
                                                        size={"14"}
                                                        role="button"
                                                        style={{ padding: 4 }}
                                                        src={IconTrash}
                                                    />
                                                    Delete
                                                </div>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* {PollQtnList.filter( element => element.operation !="Remove").length - 1 === index && (
                                <Button
                                    type="button"
                                 
                                    onClick={() =>
                                        handlePollQtnAdd(index)
                                    }
                                    className="add-btn"
                                    style={{
                                        color: "#040404",
                                        borderRadius: "6px",
                                        padding: "5px 10px",
                                        display: "flex",
                                        WebkitAlignItems: "center",
                                        WebkitBoxAlign: "center",
                                        MsFlexAlign: "center",
                                        alignItems: "center",
                                        WebkitBoxPack: "center",
                                        MsFlexPack: "center",
                                        WebkitJustifyContent: "center",
                                        justifyContent: "center",
                                        border: "0",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                        fontWeight: "600",
                                        letterSpacing: "0",
                                        WebkitTransition: "background .2s",
                                        transition: "background .2s",
                                        cursor: "pointer",
                                        backgroundColor: "#E0E0E0",
                                    }}
                                >
                                    <span>+ Add Question </span>
                                </Button>
                            )} */}
                        </div>
                    </div>:null
                ))}


                                <Button
                                    type="button"
                                 
                                    onClick={() =>
                                        handlePollQtnAdd()
                                    }
                                    className="add-btn"
                                    style={{
                                        color: "#040404",
                                        borderRadius: "6px",
                                        padding: "5px 10px",
                                        display: "flex",
                                        WebkitAlignItems: "center",
                                        WebkitBoxAlign: "center",
                                    
                                        alignItems: "center",
                                        WebkitBoxPack: "center",
                                      
                                        WebkitJustifyContent: "center",
                                        justifyContent: "center",
                                        border: "0",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                        fontWeight: "600",
                                        letterSpacing: "0",
                                        WebkitTransition: "background .2s",
                                        transition: "background .2s",
                                        cursor: "pointer",
                                        backgroundColor: "#E0E0E0",
                                    }}
                                >
                                    <span>+ Add Question </span>
                                </Button>
                            
                <div
                    style={{
                        display: "flex",
                        bottom: '5%',
                        marginLeft: 700,
                        justifyContent: "flex-end",
                        position: "absolute",
                    }}
                >
                    <Button
                        type="button"
                       
                        

                        onClick={() =>
                     {   
                      
                      setcreatePollState(false)
           
                    }
                       }
                        className="add-btn"
                        style={{
                            color: "#040404",
                            borderRadius: "6px",
                            padding: "5px 10px",
                            display: "flex",
                            WebkitAlignItems: "center",
                            WebkitBoxAlign: "center",
                            
                            alignItems: "center",
                            WebkitBoxPack: "center",
                            
                            WebkitJustifyContent: "center",
                            justifyContent: "center",
                            border: "0",
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: "600",
                            letterSpacing: "0",
                            WebkitTransition: "background .2s",
                            transition: "background .2s",
                            cursor: "pointer",
                            backgroundColor: "#E0E0E0",
                        }}
                    >
                        <span>Cancel </span>
                    </Button>

                    <Button
                        type="button"
                        onClick={handlePollSave}
                        className="add-btn"
                        style={{
                            backgroundColor: "#246FE5",
                            color: "#FFF",
                            borderRadius: "6px",
                            padding: "10px 16px",
                            display: "flex",
                            WebkitAlignItems: "center",
                            WebkitBoxAlign: "center",
                        
                            alignItems: "center",
                            WebkitBoxPack: "center",
                           
                            WebkitJustifyContent: "center",
                            justifyContent: "center",
                            border: "0",
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: "600",
                            letterSpacing: "0",
                            WebkitTransition: "background .2s",
                            transition: "background .2s",
                            cursor: "pointer",
                            marginLeft: 10,
                        }}
                    >
                        <span>Save</span>
                    </Button>
                </div>{" "}
            </div>:

<div
style={{
    minHeight: '50vh',
    textAlign: 'center',
    padding: '10%',
}}
>
{' '}
{/* <Spinner
    // @ts-ignore
    isCompleting={false}
    size="large"
/> */}
<div style={{marginTop:80,height:500, }}>
<div
style={{
margin: "auto",
width: "25%",
height: "75%",

borderRadius: "5px",
alignItems: "center",
display: "block",
padding: '20px',
// boxSizing: "border-box",
overflow: "auto",
outline: 0,
// minHeight: "inherit",
// maxHeight: "inherit",
}}
>
<RingLoader
cssOverride={{
    margin: "auto",
    width: "25%",
    height: "30%",
}}
color={"white"}
loading={loading}
/>
</div>


</div>
</div>

                    }
        </div>:  <Poll showAddmessage={showPollState}/>
        
                      }
        
        </>
    );
}

export default editPoll;
