/* eslint-disable no-console */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import {
  LinkButtons,
  SubmitButtons,
  registerButton,
  homeButton,
  loginButton,
  forgotButton,
  inputStyle,
  HeaderBar,
} from '../components';

const title = {
  pageTitle: 'OTP Verification Screen',
};

class LoginVerifyOTP extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      verification_key: '',
      otp:'',
      loggedIn: false,
      showError: false,
      showNullError: false,
    };
  }

  componentDidMount(){
    console.log(this.props.location.state)
    console.log(this.state)
    this.setState({
        verification_key: this.props.location.state.verification_key,
        username: this.props.location.state.username
      });

  }
  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  loginUser = async (e) => {
    e.preventDefault();
    const { username, verification_key, otp } = this.state;
    
    if (otp === '') {
      this.setState({
        showError: false,
        showNullError: true,
        loggedIn: false,
      });
    } else {
      try {
        console.log(username)
        const response = await axios.post('https://node-js-auth.herokuapp.com/api/v1/login/verify', {
          verification_key: verification_key,
          username: username,
          otp: otp
        });
        localStorage.setItem('JWT', response.data.token);
        console.log(response.data)
        this.setState({
          loggedIn: true,
          showError: false,
          showNullError: false,
        });
    console.log(this.state)

      } catch (error) {
        console.error(error.response.data);
        if (
          error.response.data === 'Username is not found'
          || error.response.data === 'OTP is not valid'
        ) {
          this.setState({
            showError: true,
            showNullError: false,
          });
        }
      }
    }
  };

  render() {
    const {
      username,
      otp,
      showError,
      loggedIn,
      showNullError,
    } = this.state;
    if (!loggedIn) {
      return (
        <div>
          <HeaderBar title={title} />
          <form className="profile-form" onSubmit={this.loginUser}>
            <TextField
              style={inputStyle}
              id="otp"
              label="OTP"
              value={otp}
              onChange={this.handleChange('otp')}
              placeholder="OTP"
            />
            
            <SubmitButtons buttonStyle={loginButton} buttonText="Login" />
          </form>
          {showNullError && (
            <div>
              <p>The OTP cannot be null.</p>
            </div>
          )}
          {showError && (
            <div>
              <p>
                The OTP entered cannot be verified.
              </p>
              <LinkButtons
                buttonText="Register"
                buttonStyle={registerButton}
                link="/register"
              />
            </div>
          )}
          <LinkButtons buttonText="Go Home" buttonStyle={homeButton} link="/" />
          <LinkButtons
            buttonStyle={forgotButton}
            buttonText="Forgot Password?"
            link="/forgotPassword"
          />
        </div>
      );
    }
    return <Redirect to={`/userProfile/${username}`} />;
  }
}

export default LoginVerifyOTP;
