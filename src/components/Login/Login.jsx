import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom'

import Classes from './Login.module.css';
import Home from '../Home/Home';
import ThreeDots from '../UI/ThreeDots/ThreeDots';
import OwnerDashboard from "../HotelOwner/OwnerDashboard";
import GetTowns from "../Customer/GetTowns";
import AdminDashboard from "../SystemAdmin/AdminDashboard";

class Login extends Component {
    state = {
        clicked: false,
        username: '',
        email: '',
        password: '',
        signUpError: '',
        isLoading: false,
        errorOccurs: false,
        loginSuccess: false,
        loadSignup: false,
        submitButtonName: 'Login',
        errMsg: '',
        invalidEmail: false,
        invalidPassword: false,
        emailPlaceHolder: 'Email Address',
        passwordPlaceHolder: 'Password',
        usernamePlaceHolder: 'Username',
        userType: 'Customer',

        recievedUserType: '',
        receivedUserData: '',
        // userData: ''
    }

    onChangeUsername = (e) => {
        e.preventDefault()
        this.setState({ username: e.target.value })
    }

    onChangeEmail = (e) => {
        e.preventDefault()
        this.setState({ email: e.target.value })
        // console.log(e.target.value);
    }
    onChangePassword = (e) => {
        e.preventDefault()
        this.setState({ password: e.target.value })
        // console.log(e.target.value);

    }
    onSelectUserType = (e) => {
        e.preventDefault()
        this.setState({ userType: e.target.value })
    }

    SignUpClickHandler = () => {
        if (this.state.loadSignup) {
            if (this.state.email === '' && this.state.password === '' && this.state.username === '') {
                return this.setState({ emailPlaceHolder: 'Please enter your email', passwordPlaceHolder: 'Please enter your password', usernamePlaceHolder: 'Please enter a username' })
            } else if (this.state.username === '') {
                this.setState({ usernamePlaceHolder: 'Please enter a username' })
            } else if (this.state.email === '') {
                this.setState({ emailPlaceHolder: 'Please enter your email' })
            } else if (this.state.password === '') {
                this.setState({ passwordPlaceHolder: 'Please enter your password' })
            }
        }

        this.setState({ loadSignup: true, submitButtonName: 'Signup', errorOccurs: false })
    }

    onClickHandler = (e) => {
        e.preventDefault();

        if (this.state.email === '' && this.state.password === '') {
            return this.setState({ emailPlaceHolder: 'Please enter your email', passwordPlaceHolder: 'Please enter your password' })
        } else if (this.state.password === '') {
            this.setState({ passwordPlaceHolder: 'Please enter your password' })
        } else if (this.state.email === '') {
            this.setState({ emailPlaceHolder: 'Please enter your email' })
        } else if (this.state.username === '') {
            this.setState({ usernamePlaceHolder: 'Please enter a username' })
        } else if (this.state.email && this.state.password) {
            this.setState({ clicked: true, isLoading: true, errorOccurs: false })
        }
        // console.log('inside if')

        if (!this.state.loadSignup) {
            // console.log('loadSignup...', this.state.loadSignup)
            // console.log('inside if')

            fetch(`${process.env.REACT_APP_BE_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                }),
            }).then(res => res.json())
                .then(json => {
                    // console.log('json', json);
                    // console.log('inside api call');

                    if (json.success) {
                        // console.log('get user data', json.data.token);
                        this.setState({ receivedUserData: json });

                        this.props.onLogin(json.data.token);
                        localStorage.setItem('id', json.user._id);

                        this.setState({
                            recievedUserType: json.user.userType,

                            email: '',
                            password: '',
                            isLoading: false,
                            signUpError: '',
                            errorOccurs: false,
                            loginSuccess: true,
                            receivedUserData: json,

                        });
                    }
                    else {
                        if (json.message === 'Invalid Email!') {
                            this.setState({ invalidEmail: true })
                        } else if (json.message === 'Invalid Password!') {
                            this.setState({ invalidPassword: true })
                        }

                        this.setState({
                            signUpError: json.message,
                            // email: '',
                            // password: '',
                            isLoading: false,
                            errorOccurs: true
                        });
                    }
                });

        } else if (this.state.loadSignup) {
            fetch(`${process.env.REACT_APP_BE_BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password,
                    userType: this.state.userType
                }),
            }).then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({ recievedUserType: json.user.userType });

                        this.props.onLogin(json.data);
                        // console.log('from LOGIN',json.data)
                        this.props.onLoginUserDetails(json.user);

                        this.setState({
                            // signUpError: json.message,
                            // isLoading: false,
                            username: '',
                            email: '',
                            password: '',
                            userType: '',
                            isLoading: false,
                            signUpError: '',
                            errorOccurs: false,
                            loginSuccess: true,
                            receivedUserData: json,
                            recievedUserType: json.user.userType

                        });
                    }
                    else {
                        if (json.data === 'User validation failed: email: Please fill a valid email address') {
                            this.setState({ invalidEmail: true })
                        }
                        this.setState({
                            signUpError: json.message,
                            // username: '',
                            // email: '',
                            // password: '',
                            isLoading: false,
                            errorOccurs: true,
                            errMsg: json.data

                        });
                    }
                });
        }
        // }

        if (this.state.loginSuccess) {
            return <Link to="/home" replace><Home /></Link>
        }

        // this.props.history.push('/search');
        // return <Signup/>
    }

    render() {

        return (
            <React.Fragment>
                {!this.state.loginSuccess ?
                    <>
                        <div className={Classes.FormBody}>
                            <div className={Classes.wrapper}>
                                <div className={Classes.title}>
                                    Welcome
                                </div>
                                <form action="#" onSubmit={this.onFormSubmit}>

                                    {!this.state.loadSignup ?
                                        <React.Fragment>
                                            <div className={Classes.field}>
                                                <input
                                                    type="text"
                                                    required name="email"
                                                    style={this.state.invalidEmail ?
                                                        { borderColor: "red", boxShadow: "5px 5px 5px #FF7F7F .6" }
                                                        : null} onChange={e => this.onChangeEmail(e)} />
                                                {this.state.invalidEmail ?
                                                    <label style={{ color: "red" }}>Invalid Email Address</label>
                                                    : <label>{this.state.emailPlaceHolder}</label>}
                                            </div>
                                            <div className={Classes.field}>
                                                <input
                                                    type="password"
                                                    required="required"
                                                    style={this.state.invalidPassword ? { borderColor: "red" } : null}
                                                    name="password"
                                                    autoComplete="on"
                                                    onChange={e => this.onChangePassword(e)} />
                                                {this.state.invalidPassword ?
                                                    <label style={{ color: "red" }}>Invalid Password</label> :
                                                    <label>{this.state.passwordPlaceHolder}</label>
                                                }
                                            </div>
                                        </React.Fragment>
                                        : null}
                                    {this.state.loadSignup ?
                                        <React.Fragment>
                                            <div className={Classes.field}>
                                                <input type="text" required="required" name="username" autoComplete="on" onChange={e => this.onChangeUsername(e)} />
                                                <label>{this.state.usernamePlaceHolder}</label>
                                            </div>
                                            <div className={Classes.field}>
                                                <input
                                                    type="text"
                                                    required name="email"
                                                    style={this.state.invalidEmail ?
                                                        { borderColor: "red" }
                                                        : null} onChange={e => this.onChangeEmail(e)} />
                                                {this.state.invalidEmail ?
                                                    <label style={{ color: "red" }}>Invalid Email Address</label>
                                                    : <label>Email Address</label>}
                                            </div>
                                            <div className={Classes.field}>
                                                <input type="password" required="required" name="password" autoComplete="on" onChange={e => this.onChangePassword(e)} />
                                                <label>Password</label>
                                            </div>

                                            <div className={Classes.dropdownField}>
                                                <label htmlFor="exampleFormControlSelect1">Choose user type</label>
                                                <select className={Classes.dropdownOptions} onChange={e => this.onSelectUserType(e)}>
                                                    <option>Customer</option>
                                                    <option>Hotel_Owner</option>
                                                    {/*<option>System_Admin</option>*/}

                                                </select>
                                            </div>

                                        </React.Fragment> : null
                                    }

                                    <div className={Classes.content}>
                                        <div className={Classes.checkbox}>
                                            <input type="checkbox" id="remember-me" />
                                            <label htmlFor="remember-me" className={Classes.RememberMe}>Remember me</label>
                                        </div>
                                        <div className={Classes.passLink}>
                                            <a href="/">Forgot password?</a>
                                        </div>
                                    </div>

                                    <div className={Classes.field}>
                                        <input type="submit" value={this.state.submitButtonName} onClick={e => this.onClickHandler(e)} />
                                    </div>
                                    {!this.state.loadSignup ?
                                        <div className={Classes.signupLink}>
                                            Not a member? <Link to="#" onClick={this.SignUpClickHandler}>Signup now</Link>
                                        </div> : null
                                    }

                                </form>
                                {this.state.errorOccurs ?
                                    <p style={{ color: "#c70303", paddingLeft: "10px", textAlign: "center" }}>Login Failed</p>
                                    : null}

                                {this.state.signUpError ?
                                    console.log('login error') : null
                                }
                            </div>
                        </div>
                        {this.state.isLoading ? <ThreeDots /> : null}
                    </>
                    :
                    <>
                        {this.state.recievedUserType === 'System_Admin' ?
                            <>
                                <Redirect to="/admin_dashboard" />
                                <AdminDashboard />
                                {/*<Redirect to="/home"/>*/}
                                {/*<Home/>*/}
                            </>
                            : null}

                        {this.state.recievedUserType === 'Hotel_Owner' ?
                            <>
                                <Redirect to="/owner_dashboard" />
                                <OwnerDashboard />
                            </>
                            : null}

                        {this.state.recievedUserType === 'Customer' ?
                            <>
                                <Redirect to="/get_towns" />
                                <GetTowns />
                            </>

                            : null}

                    </>
                }
                {/*<Link to="/search" replace><InputControl/></Link>*/}
            </React.Fragment>


        )
    }
}

export default Login
