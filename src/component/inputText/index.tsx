import React, { useEffect, useState } from 'react'
import './inputText.scss'

const InputText = ({placehold = "", heightType = "medium", inputType = "text",
                    maxLengthInput = -1, name = "", outChange}) => {
    // heightType => medium / large
    // inputType => text / password

    const [text, setText] = useState('');
    const [focused, setFocused] = useState(false);
    const [heightTypeState, setHeightTypeState] = useState("");

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
                <input className={`form-control input-style ${heightTypeState}`} 
                        type = "password" 
                        maxLength={maxLengthInput}
                        onFocus={handleFocus} onBlur={handleBlur} 
                        onChange={handleChange}/>
            }
            <span className='input-title'>{placehold}</span>
        </div>
    )
}

export default InputText