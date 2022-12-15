import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { IReduxState } from '../../features/app/types'
import { IQuestionDto, QANotificationDto } from '../base/cs-socket/types';


    const MessageContainerQA = () => {
    const inputReference =useRef(document.createElement("div")) ;
    const socketQaMessage= useSelector((state: IReduxState) => state["features/base/cs-socket"].socketQaMessage);

  
    const inputReferenceinpute = useRef(document.createElement("textarea"));
    const [qa, setqa] = useState("");
    const [allQa, setAllQa] = useState([]);
    const [allQaDiv, setAllQaDiv] = useState([]);
    let queryString = window.location.search;


 
    let urlParams = new URLSearchParams(queryString);

    let meetingId = urlParams.get('meetingId')
    let userId = urlParams.get('userId')
   
   
//on load first time
    useEffect(() => {
        qaFormAPI() 
        if(inputReference!=null)
        {
           inputReference.current.focus() ;
        }
           if(inputReferenceinpute!=null)
           {
        inputReferenceinpute.current.focus();
        }
        
    },[])

    useEffect(() => {
        socketQaMessage!=null?
        qaFormsocketQaMessage():null
    
        if(inputReference!=null)
        {
           inputReference.current.focus()
        }
           if(inputReferenceinpute!=null)
           {
        inputReferenceinpute.current.focus();
        }
        
    },[socketQaMessage])


//  useEffect(() => {
      
       
//     },[allQa])


    return (
        <div className="chat-panel">
<div id="chat-conversation-container">
<div aria-labelledby="QA-header" id="chatconversation" role="log" >

{allQaDiv}
<div ref={inputReference} tabIndex={1} id="QaListEnd"></div>

</div>  </div>

 <div className="chat-input-container">
        
     <div id="chat-input">
            <div className="css-1b1hdkw-inputContainer QA-input">
                <div className="css-1m7m6m3-fieldContainer">
                    <div className="jitsi-icon jitsi-icon-default css-1y59anu-icon-iconClickable" >
                        <svg height="20" width="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 18.333a8.333 8.333 0 1 1 0-16.666 8.333 8.333 0 0 1 0 16.666Zm0-1.666a6.667 6.667 0 1 0 0-13.334 6.667 6.667 0 0 0 0 13.334Zm-.752-1.774c.198.171.429.257.693.257a.988.988 0 0 0 .677-.26c.196-.174.293-.413.293-.717a.938.938 0 0 0-.28-.69.938.938 0 0 0-.69-.28.968.968 0 0 0-.703.28.927.927 0 0 0-.286.69c0 .308.099.548.296.72ZM7.161 6.76c-.264.423-.397.841-.397 1.253 0 .2.084.386.251.557a.826.826 0 0 0 .615.257c.413 0 .692-.245.84-.736.156-.468.347-.823.573-1.064.226-.24.577-.361 1.055-.361.408 0 .74.119.999.358.258.238.387.531.387.879a1 1 0 0 1-.127.494c-.084.152-.188.29-.312.414s-.325.307-.602.55c-.317.278-.569.518-.755.72a2.405 2.405 0 0 0-.45.702c-.113.268-.169.583-.169.948 0 .29.077.51.231.657a.792.792 0 0 0 .57.222c.434 0 .692-.226.775-.677.047-.213.083-.362.107-.446a1.37 1.37 0 0 1 .1-.254c.044-.085.11-.178.2-.28.088-.102.207-.22.354-.355.534-.478.904-.817 1.11-1.019a2.97 2.97 0 0 0 .534-.72c.15-.277.225-.6.225-.97 0-.468-.132-.902-.394-1.301-.263-.4-.635-.716-1.117-.948-.481-.232-1.037-.348-1.666-.348-.677 0-1.27.139-1.778.417-.507.277-.894.628-1.159 1.051Z"></path></svg></div>
                            <textarea value={qa} id="qaInput"   ref={inputReferenceinpute} onChange={e => {


   if(inputReferenceinpute!=null)
   {
    inputReferenceinpute.current.focus();
}
                          


                                e.preventDefault(); setqa(e.target.value)} }  className="css-hh0z88-input icon-input" placeholder="Your Question here" style={{height: 40}}>
                                </textarea></div></div>
                                <button aria-label="Send" onClick={() => qaSend(qa)} className="iconButton iconButton-primary"  title="Send" type="button">
                                    <div className="jitsi-icon jitsi-icon-default ">
                                        <svg fill="none" height="20" width="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m16.667 1.667-15 9.166 5.966.995.7 5.255 2.311-3.85 6.023 4.684V1.667Zm-7.93 8.655L6.35 9.924 15 4.638v9.87l-3.684-2.864L12.5 7.5l-3.763 2.822Z"></path></svg></div></button></div>

                                        
           </div> </div>

    )
    async function qaSend(Question: string) {

        let url = 'https://dev.awesomereviewstream.com/svr/api/question?meetingId='+meetingId+'&userId='+userId;
        const reqBody = {
            "meetingId": meetingId,
            "fromUserId": userId,
           "question": Question,
        };

        if (url) {
            try {
                const res = fetch(`${url}`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                      },
                    body: JSON.stringify(reqBody)
                });
    
                if ((await res).ok) {
                    qaFormAPI()
                    setqa("")
                    return true;
                }
                console.log('Status error:', (await res).status);
            } catch (err) {
                console.log('Could not send request', err);
            }
        }
  
     

        
        

      }

      function qaFormAPI() {


       
        
        let url = 'https://dev.awesomereviewstream.com/svr/api/question?meetingId='+meetingId+'&userId='+userId;

        fetch(
            url
        )
            .then((response) => response.json())
            .then((data) => {
                let qaDiv = data.map((item:{fromUserName:any; answers:any; question:any}) => (

//     let ans=item.answers.map((ans: { answerLabel: any; }) =>  
//     {
       
//        return({"name": ans.answerLabel,
//        "})
//     })
// }
                   

             <div className="qa-message-group local"><div className="chatmessage-wrapper" id="1">
                       <div className="chatmessage  lobbymessage">
                           <div className="replywrapper"><div className="messagecontent">
                            <div aria-hidden="false" className="display-name">{item.fromUserName}</div>
                            <div className="usermessage">
                                <div style={{color: "rgb(171, 195, 224)", fontWeight: 'normal'}}>Awesomereview stuff {item.answers[0]!=undefined?item.answers[0].sendTo.replace("Send",""):""}</div>
                                 <span className="sr-only"></span>
                                     <div style={{fontWeight: 'bold', paddingBottom:5}}><span style={{color: "rgb(164, 184, 209)"}}>Q : </span>{item.question} </div>
                                  
                                     {
                                    item.answers.map((ans:{answer:any}) => (
                                  <div>
                                          <span style={{color: "rgb(164, 184, 209)"}}>A : </span> {ans!=undefined?ans.answer:""}
                                          
                                          
                                          </div>))}
            

                                          </div><div></div></div></div></div>
                                        <div className="timestamp"></div>
                                        </div>
                                        </div>)
                                    
                                    
                                    
                  );
        setAllQa(data)
       
        setAllQaDiv(qaDiv)
        if(inputReference!=null)
        {
        inputReference.current.focus();
        
        }
    })


         }
         function qaFormsocketQaMessage() {
           
            let socktedata:IQuestionDto;
            socktedata=socketQaMessage!=null?socketQaMessage.data:{};

           
       allQa.map(function(obj: { id:any; answers:any;}) {
        
                (obj.id === socktedata.id) && (obj.answers = socktedata.answers);
            });
         

         

            let qaDiv:any  = allQa.map((item:{fromUserName:any;answers:any;  question:any;} ) => (



                <div className="qa-message-group local"><div className="chatmessage-wrapper" id="1">
                   <div className="chatmessage  lobbymessage">
                       <div className="replywrapper"><div className="messagecontent">
                        <div aria-hidden="false" className="display-name">{item.fromUserName}</div>
                        <div className="usermessage">
                            <div style={{color: "rgb(171, 195, 224)", fontWeight: 'normal'}}>Awesomereview stuff {item.answers[0]!=undefined?item.answers[0].sendTo:""}</div>
                             <span className="sr-only">says:</span>
                                 <div style={{fontWeight: 'bold', paddingBottom:5}}><span style={{color: "rgb(164, 184, 209)"}}>Q : </span>{item.question} </div>
                                 {
                                    item.answers.map((ans:{answer:any;}) => (
                                  <div>
                                          <span style={{color: "rgb(164, 184, 209)"}}>A : </span> {ans!=undefined?ans.answer:""}
                                          
                                          
                                          </div>))}
                                      
                                      </div><div></div></div></div></div>
                                    <div className="timestamp"></div>
                                    </div>
                                    </div>
              ));
              setAllQa(allQa)
              setAllQaDiv(qaDiv)
         }
         
}


export default MessageContainerQA;