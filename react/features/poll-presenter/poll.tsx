import React, { useCallback, useEffect, useRef, useState } from 'react';


export default function poll() {

    return (

        <div className="polls-pane-content">


            <div className="poll-container">
                <select className='pollselect' name="qtin" id="qtin">
                    <option value="qtin1">Poll 1</option>
                    <option value="qtin2">Poll 2</option>
                    <option value="qtin2">Poll 3</option>
                    <option value="qtin2">Poll 4</option>
                    <option value="qtin2">Poll 5</option>
                </select>




                <div>

                    <div className="poll-answer" style={{ margin: '36px 1px' }}><div className="poll-header"><div className="poll-question"><span>1. which medicine is best for cold (Single Choice)</span></div></div><ol className="poll-answer-list">


                        <li className="poll-answer-container"><div className='pollFormControl'>

                            <label className='pollActiveArea'>
                                <input name="30" id="61" className="pollcheckbox" type="checkbox" />
                                <div className="jitsi-icon pollActiveAreacheckmark"><svg fill="none" height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z" fill="currentColor" stroke="currentColor"></path></svg>

                                </div></label><label>Fever and pain</label></div></li>


                        <li className="poll-answer-container"><div className='pollFormControl'>

                            <label className='pollActiveArea'>
                                <input name="30" id="61" className="pollcheckbox" type="checkbox" />
                                <div className="jitsi-icon pollActiveAreacheckmark"><svg fill="none" height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z" fill="currentColor" stroke="currentColor"></path></svg>

                                </div></label><label>Acetaminophen</label></div></li>
                        <li className="poll-answer-container"><div className='pollFormControl'>

                            <label className='pollActiveArea'>
                                <input name="30" id="61" className="pollcheckbox" type="checkbox" />
                                <div className="jitsi-icon pollActiveAreacheckmark"><svg fill="none" height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z" fill="currentColor" stroke="currentColor"></path></svg>

                                </div></label><label>answer C</label></div></li>

                    </ol>
                        <div className="poll-footer poll-answer-footer">




                        </div></div>


                    <div className="poll-answer" style={{ margin: '36px 1px' }}><div className="poll-header"><div className="poll-question"><span>question2</span></div></div><ol className="poll-answer-list">


                        <li className="poll-answer-container"><div className='pollFormControl'>

                            <label className='pollActiveArea'>
                                <input name="30" id="61" className="pollRadio" type="checkbox" />
                                <div className="jitsi-icon pollActiveAreacheckmark"><svg fill="none" height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z" fill="currentColor" stroke="currentColor"></path></svg>

                                </div></label><label>answer A</label></div></li>


                        <li className="poll-answer-container"><div className='pollFormControl'>

                            <label className='pollActiveArea'>
                                <input name="30" id="61" className="pollRadio" type="checkbox" />
                                <div className="jitsi-icon pollActiveAreacheckmark"><svg fill="none" height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M4.948 9.047a.524.524 0 0 0-.785 0 .643.643 0 0 0 0 .855l2.683 2.92c.217.238.57.237.787 0l6.205-6.79a.643.643 0 0 0-.002-.856.524.524 0 0 0-.785.002L7.238 11.54l-2.29-2.492Z" fill="currentColor" stroke="currentColor"></path></svg>

                                </div></label><label>answer B</label></div></li>

                    </ol>
                        <div className="poll-footer poll-answer-footer">




                        </div></div>


<div>

<div>Enter Poll Duration</div>
<input name="30" id="61" placeholder='Enter Poll Duration' type="text" />
                    <button aria-label="Launch" className="pollbtn" title="Launch" type="button">Launch</button>
                  
                  
                  
                    </div>
                </div>






            </div>



        </div>





    )

}