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

	const [valInput, setValInput] = useState({});	// input form sign in
	const [valInputForgot, setValInputForgot] = useState({});	// input form forgot

	const [statusFormShowSignIn, setStatusFormShowSignIn] = useState(true);
	const [statusFormShowForgot, setStatusFormShowForgot] = useState(false);

	const [errorMsgForgot, setErrorMsgForgot] = useState("");

	const [inputInvalid, setInputInvalid] = useState({
		'username': false,
		'password': false
	});
	const [inputForgotInvalid, setInputForgotInvalid] = useState({
		'email': false
	});


	useEffect(() => {

		const timer = setTimeout(() => {
			const script = document.createElement("script");
			script.src = "js/custom.js";
			script.async = true;
			document.body.appendChild(script);
		}, 1000);
		return () => clearTimeout(timer);

	}, []);

	// const handleFinalFormSubmit = (values: any) => {

	// 	const { ...dataLogin } = values;
	// 	let newDataLogin = {
	// 		username: dataLogin.username,
	// 		password: dataLogin.password
	// 	};

	// 	const res = login(newDataLogin);
	// 	res.then(function (response) {
	// 		if (response.statusCode == 200) {
	// 			setStatus(0);
	// 			history.push("/");
	// 			window.location.reload();
	// 		} else {
	// 			setMessage(response.message)
	// 			setStatus(response.statusCode)
	// 		}
	// 	});
	// }

	const onChangeInput = (val:any, form:any) => {
		let obj:any = val;

		if (form == 'signin')
		{
			if (typeof (obj?.['name']) != 'undefined' &&
				typeof (obj?.['value']) != 'undefined'){
	
				let valInputTemp:any = {...valInput};	// copy ke variable temp
				valInputTemp[obj?.['name']] = obj?.['value'];
				setValInput(valInputTemp);
				console.log(valInputTemp)
			}
		}
		else if (form == 'forgot')
		{
			if (typeof (obj?.['name']) != 'undefined' &&
				typeof (obj?.['value']) != 'undefined'){
	
				let valInputForgotTemp:any = {...valInputForgot};	// copy ke variable temp
				valInputForgotTemp[obj?.['name']] = obj?.['value'];
				setValInputForgot(valInputForgotTemp);
				console.log(valInputForgotTemp)
			}
		}
	}

	const handleClickForgot = (jenisForm:any) => {
		if (jenisForm == 'forgot')
		{
			setStatusFormShowForgot(true);
			setStatusFormShowSignIn(false);
		}
		else if (jenisForm == 'back_to_login')
		{
			setStatusFormShowForgot(false);
			setStatusFormShowSignIn(true);
		}
	}

	const handleFinalSubmit = (form:any) => {
		
		if (form == 'signin')
		{
			let inputInvalidTemp = {...inputInvalid};
			Object.keys(inputInvalidTemp).forEach((key)=>{
				let val:any = valInput?.[key];
				if (val == null || typeof val == 'undefined' || val == ""){
					inputInvalidTemp[key] = true;
				}
				else {
					inputInvalidTemp[key] = false;
				}
			})
			setInputInvalid(inputInvalidTemp);
		}
		else if (form == 'forgot')
		{
			let CekInvalid:boolean = false;
			let inputForgotInvalidTemp = {...inputForgotInvalid};
			Object.keys(inputForgotInvalidTemp).forEach((key)=>{
				let val:any = valInputForgot?.[key];
				if (val == null || typeof val == 'undefined' || val == ""){
					inputForgotInvalidTemp[key] = true;
					CekInvalid = true
				}
				else {
					inputForgotInvalidTemp[key] = false;
				}
			})
			setInputForgotInvalid(inputForgotInvalidTemp);
			
			// jika masih valid, maka cek apakah email valid
			if (!CekInvalid){
				let patt = new RegExp(/[a-zA-Z0-9-.,#$%^&]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,}/gi);
				if (!patt.test(valInputForgot?.['email']))
				{
					setErrorMsgForgot("Email is invalid")
				}
				else {
					setErrorMsgForgot("");
				}
			}
			else{
				setErrorMsgForgot("Email is required")
			}

		}

	}

	return (
		<div>
			<div className='loginpage-wrapper'>  
				
				<div className='login-side-left'>
					{/* sign in */}
					<div className={`login-img-side-left ${statusFormShowSignIn ? 'show' : ''}`}></div>

					{/* forgot password */}
					<div className={`login-img-side-left-forgotpass ${statusFormShowForgot ? 'show' : ''}`}></div>
				</div>

				<div className='login-side-right d-flex align-items-center'>

					<div className='login-side-right-wrapper'>

						{/* Forgot Password */}
						<div className={`forgotpass ${statusFormShowForgot ? 'show' : ''}`}>

							<h5 className='login-side-right-title'>Forgot Password?</h5>
							<p className='login-side-right-p-forgot'>Enter your email and we'll send you instructions to reset your password</p>

							<form className='form-custom'
								onSubmit={(event)=>event?.preventDefault()}>

								<div className='form-group'>
									<React.Fragment>
										<InputText placehold={'Email'} heightType={'large'} inputType='text' 
												name = {"email"}
												maxLengthInput={150}
												outChange={(val)=>{onChangeInput(val,'forgot')}}
										/>

										<div className='text-danger'>
											{(inputForgotInvalid['email'] || errorMsgForgot.trim() != "") && (<span>{errorMsgForgot}</span>)}
											{/* {meta.error && meta.touched && (<span>{meta.error}</span>)} */}
										</div>
									</React.Fragment>

								</div>

								<div>
									<Button variant="contained" className='button-sign-in' onClick={()=>handleFinalSubmit('forgot')}>Send Reset Link</Button>
								</div>

								<div className='d-flex justify-content-center align-items-center'>

									<a className='back-to-login' onClick={()=>{handleClickForgot('back_to_login')}}>{'< Back to login'}</a>

								</div>

							</form>

						</div>


						{/* Sign In */}
						<div className={`signin ${statusFormShowSignIn ? 'show' : ''}`}>

							<h5 className='login-side-right-title'>Sign In</h5>
							<h6 className='login-side-right-subtitle'> Welcome !</h6>
							<p className='login-side-right-p'>Please sign-in to your account and start the adventure</p>

							<form className='form-custom'>
										
								<div className='form-group'>
									<React.Fragment>
										<InputText placehold={'Username'} heightType={'large'} inputType='text' 
												maxLengthInput={100}
												outChange={(val)=>{onChangeInput(val,'signin')}}
												name = {"username"}
										/>

										<div className='text-danger'>
											{inputInvalid['username'] && (<span>{'Username is required'}</span>)}
											{/* {meta.error && meta.touched && (<span>{meta.error}</span>)} */}
										</div>
									</React.Fragment>
								</div>

								<div className='form-group'>
									<React.Fragment>
										<InputText placehold={'Password'} heightType={'large'} inputType='password'
											maxLengthInput={100}
											name = "password"
											outChange={(val)=>{onChangeInput(val,'signin')}}
										/>
										<div className='text-danger'>
											{inputInvalid['password'] && (<span>{'Password is required'}</span>)}
											{/* {meta.error && meta.touched && (<span>{meta.error}</span>)} */}
										</div>
									</React.Fragment>
								</div>

								<div className='d-flex justify-content-between align-items-center'>

									<CheckBoxInput labelCheck='Remember Me' name='remember_me' outChange={onChangeInput} />
									<a className='forgot-password' onClick={()=>{handleClickForgot('forgot')}}>Forgot Password?</a>

								</div>

								<div>
									<Button variant="contained" className='button-sign-in' onClick={()=>handleFinalSubmit('signin')}>Sign In</Button>
								</div>

							</form>

							{/* <Form
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
																	maxLengthInput={100}
																	outChange={onChangeInput}
																	name = {"username"}
															/>
															<input {...input} type="text" className='form-control' placeholder="Username" />

															<div className='text-danger'>
																<span>{meta.error}</span>
																{meta.error && meta.touched && (<span>{meta.error}</span>)}
															</div>
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
																<div className='text-danger'>
																	{meta.error && meta.touched && (<span>{meta.error}</span>)}
																</div>
														</React.Fragment>
													)
												}}
											</Field>
										</div>

									</form>
								)}
							>
							</Form> */}
						</div>

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