import React, { useContext, useEffect, useState } from 'react';
import { Form, Field } from "react-final-form";
import history from '../utils/history';
import { RootStoreContext } from '../stores/RootStore';
import Alert from '../utils/alert';
import { Link } from 'react-router-dom';
import './loginpage.scss'
import ImgBoyWithRocketLight from '../assets/img/boy-with-rocket-light.png'
import { error } from 'console';
import InputText from '../component/inputText';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import CheckBoxInput from '../component/checkBoxInput';

const label = { inputProps: {'aria-label':'checkbox-mui'}}
  

const Login = () => {

	const rootStore = useContext(RootStoreContext);
	const { login } = rootStore.authenticationStore;
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState(0);

	const [valInput, setValInput] = useState({});

	useEffect(() => {

		const timer = setTimeout(() => {
			const script = document.createElement("script");
			script.src = "js/custom.js";
			script.async = true;
			document.body.appendChild(script);
		}, 1000);
		return () => clearTimeout(timer);

	}, []);

	const handleFinalFormSubmit = (values: any) => {


		const { ...dataLogin } = values;
		let newDataLogin = {
			username: dataLogin.username,
			password: dataLogin.password
		};

		const res = login(newDataLogin);
		res.then(function (response) {
			if (response.statusCode == 200) {
				setStatus(0);
				history.push("/");
				window.location.reload();
			} else {
				setMessage(response.message)
				setStatus(response.statusCode)
			}
		});
	}

	const onChangeInput = (val:any) => {
		let obj:any = val;

		if (typeof (obj?.['name']) != 'undefined' &&
			typeof (obj?.['value']) != 'undefined'){

			let valInputTemp:any = {...valInput};
			valInputTemp[obj?.['name']] = obj?.['value'];
			setValInput(valInputTemp);
			console.log(valInputTemp)
		}

	}

	return (
		<div>
			<div className='loginpage-wrapper'>  
				
				<div className='login-side-left'>
					<div className='login-img-side-left'></div>
				</div>

				<div className='login-side-right'>
					<div className='login-side-right-wrapper'>
						<h5 className='login-side-right-title'>Sign In</h5>
						<h6 className='login-side-right-subtitle'> Welcome !</h6>
						<p className='login-side-right-p'>Please sign-in to your account and start the adventure</p>

						<Form
							onSubmit={handleFinalFormSubmit}
							validate={(values) => {
								const errors: any = {};
								if (!values.username){
									errors.username = "Username is required";
								}
								if (!values.password){
									errors.password = "Password is required";
								}
								return errors;
							}}
							render={({ handleSubmit })=> (
								<form method="POST" 
										className='form-custom'
										onSubmit={handleSubmit}>
									<div className='form-group'>
										<Field name="username">
											{({input, meta})=> {
												return (
													<React.Fragment>
														<InputText placehold={'Username'} heightType={'large'} inputType='text' 
																name = "username"
																maxLengthInput={100}
																outChange={onChangeInput}
														/>
														{/* <input {...input} type="text" className='form-control' placeholder="Username" /> */}

														{/* <div className='text-danger'>
															{meta.error && meta.touched && (<span>{meta.error}</span>)}
														</div> */}
													</React.Fragment>
												)
											}}
										</Field>
									</div>
									<div className='form-group'>
										<Field name="password">
											{({input, meta})=>{
												return (
													<React.Fragment>
															<InputText placehold={'Password'} heightType={'large'} inputType='password'
																maxLengthInput={100}
																name = "password"
																outChange={onChangeInput}
															/>
															{/* <div className='text-danger'>
																{meta.error && meta.touched && (<span>{meta.error}</span>)}
															</div> */}
													</React.Fragment>
												)
											}}
										</Field>
									</div>

									<div className='d-flex justify-content-between align-items-center'>

										<CheckBoxInput labelCheck='Remember Me' name='remember_me' outChange={onChangeInput} />
										<a className='forgot-password'>Forgot Password?</a>

									</div>

									<div>
										<Button variant="contained" className='button-sign-in'>Sign In</Button>
									</div>

								</form>
							)}
						>
						</Form>
					</div>
				</div>

			</div>

			{/* <img src={ImgBoyWithRocketLight} className='login-img-side-left' /> */}

			{/* <div className="gray-bg" style={{ height: "100vh" }}>
				<div className="loginColumns animated fadeInDown">
					<div className="col-md-12">
						<div className="row">
							<div className="col-md-12">
								<div className="ibox-content">
									{
										status != 0 ?
											<> <Alert message={message} status={status} /> </> : <> </>
									}
									<Form
										onSubmit={handleFinalFormSubmit}
										validate={(values: { username: any; password: any; }) => {
											const errors: any = {};
											if (!values.username) {
												errors.username = "Username is required";
											}

											if (!values.password) {
												errors.password = "Password is required";
											}
											return errors;
										}}
										render={({ handleSubmit }) => (
											<form className="m-t" method="POST" onSubmit={handleSubmit}>
												<div className="form-group">
													<Field name="username">
														{({ input, meta }) => {
															return (
																<React.Fragment>
																	<input {...input} type="text" className="form-control" placeholder="Username" />
																	<div className="text-danger">
																		{meta.error && meta.touched && (<span>{meta.error}</span>)}
																	</div>
																</React.Fragment>
															);
														}}
													</Field>
												</div>
												<div className="form-group">
													<Field name="password">
														{({ input, meta }) => {
															return (
																<React.Fragment>
																	<input {...input} type="password" className="form-control" placeholder="Password" />
																	<div className="text-danger">
																		{meta.error && meta.touched && (<span>{meta.error}</span>)}
																	</div>
																</React.Fragment>
															);
														}}
													</Field>
												</div>
												<button type="submit" className="ladda-button btn btn-primary block full-width m-b" data-style="zoom-in" >Login</button>
												
											</form>
										)}
									/>
								</div>
							</div>
						</div>
						<hr />
						<div className="row">
							<div className="col-md-6">
								PT Best Agro International
							</div>
							<div className="col-md-6 text-right">
								<small>© 2021</small>
							</div>
						</div>
					</div>
				</div>
			</div> */}
		</div>
	);
}

export default Login;