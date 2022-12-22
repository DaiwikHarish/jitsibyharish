import React, { useCallback, useEffect, useRef, useState } from 'react';


export default function poll() {

    return(
    
    <div className="polls-pane-content">
       
        {/* <div style="text-align: center; font-weight: bold; font-size: 18px; text-transform: uppercase; padding: 3px;">poll1</div>
        */}
        <div className="poll-container">
        <select className='poll-select' name="qtin" id="qtin">
    <option value="qtin1">qtin1</option>
    <option value="qtin2">qtin2</option>
   
  </select>

  
  
            {/* <div className="poll-results">
                <div className="poll-header">
                    <div className="poll-question">
                        <strong>question1</strong></div></div><ol className="poll-result-list"><li>
                            <div className="poll-answer-header"><span className="poll-answer-vote-name">question A</span></div>
                            <div className="poll-answer-short-results"><span className="poll-bar-container">
                                <div className="poll-bar" style={{width: '0%'}}></div></span>
                                <div className="poll-answer-vote-count-container">
                                    <span className="poll-answer-vote-count">(0/206) 0.00%</span></div></div></li>
                                    <li><div className="poll-answer-header"><span className="poll-answer-vote-name">question B</span></div><div className="poll-answer-short-results"><span className="poll-bar-container"><div className="poll-bar" style={{width: '0.49%'}}></div></span><div className="poll-answer-vote-count-container"><span className="poll-answer-vote-count">(1/206) 0.49%</span></div></div></li></ol></div>
                                    
                                    
                                     */}
                                    
                                    
                                    <div><div className="poll-answer"><div className="poll-header"><div className="poll-question"><span>question1</span></div></div><ol className="poll-answer-list"><li className="poll-answer-container"><div className="css-9s1o5g-formControl"><label className="css-i8bpwv-activeArea">
                                        <input name="30" id="61" type="checkbox"/>
                                            <div className="jitsi-icon checkmark"><svg fill="none" height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z" fill="currentColor" stroke="currentColor"></path></svg>
                                            
                                            </div></label><label>question A</label></div></li><li className="poll-answer-container"><div className="css-9s1o5g-formControl"><label className="css-i8bpwv-activeArea">
                                                
                                                <input name="30" id="62" type="checkbox"/><div className="jitsi-icon checkmark"><svg fill="none" height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z" fill="currentColor" stroke="currentColor"></path></svg></div></label><label>question B</label></div></li></ol>
                                                <div className="poll-footer poll-answer-footer">
                                                 
                                                <button aria-label="Launch" className="poll-btn"  title="Launch" type="button">Launch</button></div></div></div></div></div>
    
   
  
  
  
  )

}