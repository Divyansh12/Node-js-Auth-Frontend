/* eslint-disable camelcase */
/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import {
  LinkButtons,
  deleteButton,
  loginButton,
  HeaderBar
} from '../components';

const loading = {
  margin: '1em',
  fontSize: '24px',
};

const title = {
  pageTitle: 'User Profile Screen',
};

class User_Logins extends Component {
  serial = 0;

  constructor() {
    super();

    this.state = {
      user_logins: [],
      isLoading: true,
      deleted: false,
      error: false,
    };
  }

  getSerial() {
    return ++this.serial;
  }

  async componentDidMount() {
    const accessString = localStorage.getItem('JWT');
    if (accessString == null) {
      this.setState({
        isLoading: false,
        error: true,
      });
    } else {
      try {
        const response = await axios.get('http://localhost:4500/api/v1/user/logins/show', {
          headers: { Authorization: `Bearer ${accessString}` },
        });
        console.log(response.data);
        this.setState({
            user_logins: response.data.user_logins,
            isLoading: false,
            error: false,
        });
      } catch (error) {
        console.error(error.response.data);
        this.setState({
          error: true,
        });
      }
    }
  }

  
  deleteLogin = async (id,current) => {
    const accessString = localStorage.getItem('JWT');
    if (accessString === null) {
      this.setState({
        isLoading: false,
        error: true,
      });
    }
    console.log(id);
    try {
      const response = await axios.get(`http://localhost:4500/api/v1/user/logins/delete/${id}`, {
        
        headers: { Authorization: `Bearer ${accessString}` },
      });
      console.log(response.data);
      if(current){
        this.setState({
          error: true,
        });
      }
    } catch (error) {
      console.error(error.response.data);
      this.setState({
        error: true,
      });
    }
  };

LogoutAll = async (e) => {
    const accessString = localStorage.getItem('JWT');
    
    if (accessString === null) {
      this.setState({
        isLoading: false,
        error: true,
      });
    }

    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:4500/api/v1/user/logins/deletes/all', {
        
        headers: { Authorization: `Bearer ${accessString}` },
      });
      console.log(response.data);
      this.setState({
        error: true,
      });
    } catch (error) {
      console.error(error.response.data);
      this.setState({
        error: true,
      });
    }
  };

LogoutAllNotCurrent = async (e) => {
    const accessString = localStorage.getItem('JWT');
    
    if (accessString === null) {
      this.setState({
        isLoading: false,
        error: true,
      });
    }
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:4500/api/v1/user/logins/delete/all/not-current', {
        
        headers: { Authorization: `Bearer ${accessString}` },
      });
      console.log(response.data);
      this.setState({
        deleted: false,
      });
    } catch (error) {
      console.error(error.response.data);
      this.setState({
        error: true,
      });
    }
  };
  
  render() {
    this.serial = 0;
    const {
      user_logins,
      error,
      isLoading,
      deleted,
    } = this.state;

    if (error) {
      return (
        <div>
          <HeaderBar title={title} />
          <div style={loading}>
            Problem fetching user data. Please login again.
          </div>
          <LinkButtons
            buttonText="Login"
            buttonStyle={loginButton}
            link="/login"
          />
        </div>
      );
    }
    if (isLoading) {
      return (
        <div>
          <HeaderBar title={title} />
          <div style={loading}>Loading User Data...</div>
        </div>
      );
    }
    if (deleted) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <HeaderBar title={title} />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Login Time</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Current</TableCell>
              <TableCell>Log Out</TableCell>
            </TableRow>
             {user_logins.map(login=>{
                    const { id,device , ip_address, logged_in_at, current} = login;
                    
                    return (<TableRow key={id}>
                            <TableCell>{this.getSerial()}</TableCell>
                            <TableCell>{device}</TableCell>
                            <TableCell>{logged_in_at}</TableCell>
                            <TableCell>{ip_address}</TableCell>
                            <TableCell>{(current)?"Current":""}</TableCell>
                            <TableCell>
                                <Button
                                    style={deleteButton}
                                    variant="contained"
                                    color="primary"
                                    onClick={this.deleteLogin.bind(this,id,current)}
                                    >
                                    Logout
                                </Button>
                            </TableCell>
                        </TableRow>
                    )})}
          </TableBody>
        </Table>
        <Button
          style={deleteButton}
          variant="contained"
          color="primary"
          onClick={this.LogoutAll}
        >
          Logout from all devices
        </Button>
        <Button
          style={deleteButton}
          variant="contained"
          color="primary"
          onClick={this.LogoutAllNotCurrent}
        >
          Logout from all devices but not current
        </Button>
      </div>
    );
  }
}

User_Logins.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
  }),
};

export default User_Logins;
