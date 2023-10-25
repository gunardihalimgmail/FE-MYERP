import React, { useEffect, useState } from 'react'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const label = {inputProps: {'aria-label':'checkbox-mui'}}

const CheckBoxInput = ({labelCheck = "", name = "", outChange}) => {
    // labelCheck => label misal "Remember Me"

    const [checked, setChecked] = useState('');

    useEffect(()=>{

    },[])

    const handleChange = (event) => {
        setChecked(event.target.checked)
        outChange({value: event.target.checked, name})
    }

    return (
        <div>
            <FormGroup>
                <FormControlLabel control={
                            <Checkbox {...label} 
                                color="primary" defaultChecked
                                size='medium'
                            />} 
                    sx={{
                        '& .MuiFormControlLabel-label' : {fontSize:'0.8rem'}
                    }}
                    onChange={handleChange}

                    label = {labelCheck} />
            </FormGroup>	
        </div>
    )
}

export default CheckBoxInput