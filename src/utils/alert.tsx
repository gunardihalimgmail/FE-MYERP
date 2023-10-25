import React, {useState,useEffect} from 'react';

const Alert = (props:any) => {

    const [flag, setFlag] = useState(String) 
    const status = props.status

    useEffect(() => {
        if(status === 200){
            setFlag("alert alert-success alert-dismissable")
        }else{
            setFlag("alert alert-danger alert-dismissable")
        }
    },[status])


    return(
        <div className={flag}>
            <button aria-hidden="true" data-dismiss="alert" className="close" type="button">×</button>
            {props.message}
        </div>
    );
}

export default Alert;