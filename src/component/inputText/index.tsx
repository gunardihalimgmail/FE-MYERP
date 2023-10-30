import React, { useEffect, useState } from 'react'
import './inputText.scss'
import {svgCustom} from '../../utils/svgcustom'

const InputText = ({placehold = "", heightType = "medium", inputType = "text",
                    maxLengthInput = -1, name = "", outChange}) => {
    // heightType => medium / large
    // inputType => text / password

    const [text, setText] = useState('');
    const [focused, setFocused] = useState(false);
    const [heightTypeState, setHeightTypeState] = useState("");
    const [showText, setShowText] = useState(false);

    useEffect(()=>{
        switch(heightType)
        {
            case 'large': setHeightTypeState('large'); break;
            case 'medium': setHeightTypeState('medium'); break;
            default: setHeightTypeState('medium');break;
        }

    },[])
    
    const handleFocus = () => {
        setFocused(true);
    }

    const handleBlur = () => {
        if (text == ''){
            setFocused(false);
        }
    }

    const handleChange = (event) => {
        setText(event.target.value)
        outChange({value: event.target.value, name})
    }

    
    const handleClickIconPassword = () => {
        if (showText){ // password
            setShowText(false)
        }
        else{
            setShowText(true)
        }
    }
    

    return (
        <div className={`box-input ${focused ? 'focused' : ''} ${heightTypeState}`}>
            {
                inputType == 'text' &&
                <input className={`form-control input-style ${heightTypeState}`} 
                        type = "text" 
                        maxLength={maxLengthInput}
                        onFocus={handleFocus} onBlur={handleBlur} 
                        onChange={handleChange}/>
            }
            {
                inputType == 'password' &&
                (
                    <div className='password-container'>
                        <input className={`form-control input-style ${heightTypeState} input-password`} 
                                // type = "password" 
                                type = {`${showText ? 'text':'password'}`}
                                maxLength={maxLengthInput}
                                onFocus={handleFocus} onBlur={handleBlur} 
                                onChange={handleChange}/>

                        <div className='password-hideshow-icon' 
                            onClick={handleClickIconPassword}>

                            <div className = {`monkey ${showText ? 'show' : ''}`}>
                                <svg>
                                    <use xlinkHref="#monkey" />
                                </svg>
                            </div>

                            <div className={`monkey-hands ${showText ? 'show' : ''}`}>
                                <svg>
                                    <use xlinkHref="#monkey-hands" />
                                </svg>
                            </div>
                            
                            
                        </div>
                        {
                            svgCustom('monkey_and_hands')
                        }
                    </div>
                )
                
            }
            <span className='input-title'>{placehold}</span>
        </div>
    )
}

export default InputText