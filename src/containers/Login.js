/* eslint-disable no-console */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
// https://node-js-auth.herokuapp.com

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
  pageTitle: 'Login Screen',
};

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      otpReceived: false,
      showError: false,
      showNullError: false,
    };
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  loginUser = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    if (username === '' || password === '') {
      this.setState({
        showError: false,
        showNullError: true,
        otpReceived: false,
      });
    } else {
      try {
        const response = await axios.post('https://node-js-auth.herokuapp.com/api/v1/loginUser', {
          username,
          password,
        });

        console.log(response)

        this.setState({
          verification_key: response.data.Details,
          otpReceived: true,
          showError: false,
          showNullError: false,
        });
        
        this.props.history.push( {pathname: "/login/verify/otp",
        state: { username: this.state.username,
          verification_key: response.data.Details
         }
        
        });
      } catch (error) {
        console.error(error.response.data);
        if (
          error.response.data === 'Username or password is wrong'
          || error.response.data === 'Password is incorrect'
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
      password,
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
              id="username"
              label="username"
              value={username}
              onChange={this.handleChange('username')}
              placeholder="Username"
            />
            <TextField
              style={inputStyle}
              id="password"
              label="password"
              value={password}
              onChange={this.handleChange('password')}
              placeholder="Password"
              type="password"
            />
             <SubmitButtons buttonStyle={loginButton} buttonText="Get OTP" />
          </form>
          {showNullError && (
            <div>
              <p>The username or password cannot be null.</p>
            </div>
          )}
          {showError && (
            <div>
              <p>
                That username or password isn&apos;t recognized. Please try
                again or register now.
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
    
  }
}

export default Login;
