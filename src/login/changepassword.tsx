import React, {useContext, useState} from 'react';
import { RootStoreContext } from '../stores/RootStore';
import { Form, Field } from "react-final-form";
import Alert from '../utils/alert';
import { getIdLogin } from '../utils/loginuseraccess';
import swal from "sweetalert";

const ChangePassword = () =>  {

    const rootStore = useContext(RootStoreContext);
    const { changepassword } = rootStore.authenticationStore;
    const [message, setMessage] = useState("") 
    const [status, setStatus] = useState(0) 
    const [disable, setDisable] = useState(false) 

    const id_ms_login: Number = getIdLogin();

    const handleFinalFormSubmit = (values: any) => {

        const { ...data } = values;

        let newData = {
            Old_Password: data.old_password,
            New_Password: data.password, 
            Id_Ms_Login: id_ms_login
        };

        const res = changepassword(newData).then(function(response) {
            setMessage(response.message)
            setStatus(response.statusCode)
            if(response.statusCode==200){
                setDisable(true)
                // swal("Berhasil ubah password!", "Silahkan login ulang", "success");
            }
        })  
    };
    
    return (
        <div>
            <div className="row wrapper border-bottom white-bg page-heading">
                <div className="col-lg-10">
                    <h2>Change Password</h2>
                </div>
            </div>
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ibox ">
                            <div className="ibox-title">
                                <h5>Change Password</h5>
                            </div>
                            <div className="ibox-content">
                                {
                                    status!=0 ? 
                                    <> <Alert  message={message} status={status} /> </> : <> </> 
                                }
                                <Form
                                    onSubmit={handleFinalFormSubmit}
                                    validate={ values => {
                                        const errors:any = {};
                                        if(!values.old_password){
                                            errors.old_password = "Old Password is required";
                                        }
                                        
                                        // else if(values.old_password.length < 3){
                                        //     errors.old_password = "Old Password is too short"
                                        // }

                                        if(!values.password){
                                            errors.password = "New Password is required";
                                        }
                                        
                                        // else if(values.password.length < 3){
                                        //     errors.password = "New Password is too short"
                                        // }

                                        return errors;
                                    }}
                                    render={({ handleSubmit  }) => (
                                        <form className="m-t" method="POST" onSubmit={handleSubmit}> 
                                            <div className="form-group  row">
                                                <Field name="old_password">
                                                    {( {input, meta}) => {
                                                        return (
                                                           <React.Fragment>
                                                                <label className="col-sm-2 col-form-label">Old Password</label>
                                                                <div className="col-sm-6">
                                                                    <input {...input} type="password" className="form-control" />
                                                                </div>
                                                                <div className="text-danger">
                                                                    {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                                </div>
                                                           </React.Fragment>
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                            <div className="form-group  row">
                                                <Field name="password">
                                                    {( {input, meta}) => {
                                                        return (
                                                           <React.Fragment>
                                                                <label className="col-sm-2 col-form-label">New Password</label>
                                                                <div className="col-sm-6">
                                                                    <input {...input} type="password" className="form-control" />
                                                                </div>
                                                                <div className="text-danger">
                                                                    {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                                </div>
                                                           </React.Fragment>
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group  row">
                                                <label className="col-sm-2 col-form-label"></label>
                                                <div className="col-sm-6">
                                                    <button disabled={disable} className="btn btn-primary" type="submit">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;