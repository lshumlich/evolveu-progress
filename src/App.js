/*

EvolveU: Colors

blue #42a0bc / rgb(66, 160, 188)
green #97c444 / rgb(151, 196, 68)

for testing ./start

*/

import React, { Component } from "react";
import evolveu from "./EvolveU.jpeg";
import Questions from "./components/questions/questions";
import SignIn from "./components/signin";
import Register from "./components/register";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user_token: "",
      name: "",
      new_user: "",
      admin: "",
      message: "",
      wait: "",
    };
  }
  //
  // Check to see if this user has a valid session from earlier.
  // If they do we don't require a signon
  //
  componentDidMount = () => {
    this.setState({
      wait: "Please Wait",
    });

    const user_token = localStorage.getItem('user_token');

    if (user_token) {     // Check to see if it is still a valid token to the server
      fetch(process.env.REACT_APP_API + "/validuser", {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          user_token: user_token
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Error status: ' + response.status);
      })      
      .then(data => {
        this.setState({
          user_token: user_token,
          name: data.name,
          wait: "",
        });

      })
      .catch(err => {
        console.log("It's ok just not a valid user.",err);
        this.setState({
          wait: "",
        });
      })
    }
    // console.log('After component mounted:', this.state.user_token);
  };

  //
  // Use Google Auth0
  //
  onGoogleSignonSuccess = (response) => {
    this.setState({
      wait: "Please Wait",
    });
    // console.log("Starting onGoogleSignonSuccess:",  Date.now());
    // console.log('googleSuccess........',response);
    // let profile = response.getBasicProfile();
    let user_token = response.getAuthResponse().id_token;
    // console.log('authToken', profile.getId());
    // console.log('id_token', id_token);
    // console.log('name', profile.getName());
    fetch(process.env.REACT_APP_API + "/gsignon", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({
        user_token: user_token,
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        this.setState({message: "Error from server: " + response.status});
        throw new Error('Error status: ' + response.status);
      })
    .then(data => {
        // console.log('---Response from server---', data);
        // console.log(data);
        this.setState({
          user_token: user_token,
          name: data.name,
          admin: data.admin,
          new_user: data.new_user,
          wait: "",
        });
        localStorage.setItem('user_token', user_token);
        console.log("*** token set");
        console.log("Ending onGoogleSignonSuccess:",  Date.now());
      })
    .catch(err => {
      console.log(err)
      this.setState({
        wait: "Error in Google Signon Success",
      });
    });

    // console.log('Admin:', this.state.admin);
  };

  onGoogleSignonFail = (response) => {
    console.log('googleFail........',response);
    this.setState({
      wait: "Google Signon Failed",
    });
  };

  //
  // Register a new user to the system
  //
  onRegister = name => {
    fetch(process.env.REACT_APP_API + "/register", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        user_token: this.state.user_token,
        name: name,
      })
    })
    .then(response => {
        if (response.ok) {
          return response.json()
        }
        this.setState({message: "Error from server: " + response.status});
        throw new Error('Error status: ' + response.status);
    })
    .then(data => {
        this.setState({
          name: data.name,
          new_user: false,
        })
      })
    .catch(err => console.log(err));
  };

  onSignout = () => {
    // console.log("We should be doing a signout");
    localStorage.removeItem('user_token');
    fetch(process.env.REACT_APP_API + "/signout", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({
        user_token: this.state.user_token,
      })
    })
    this.setState({user_token: ""});
  }

  render() {
    let body;

    if (this.state.message) {
      body = <h1> {this.state.message} </h1>;
    } else if (this.state.wait) {
      body = <h1> {this.state.wait} </h1>;
    } else if (! this.state.user_token) {
      body = <SignIn 
                onSignin={this.onSignin} 
                onGoogleSignonSuccess={this.onGoogleSignonSuccess}
                onGoogleSignonFail={this.onGoogleSignonFail}

              />;
    } else if (this.state.new_user){
      body = <Register 
                onRegister={this.onRegister}
                name={this.state.name}
              />;
    } else {
      body = <Questions 
                user_token={this.state.user_token} 
                onSignout = {this.onSignout}
                admin={this.state.admin}
              />;
    }

    const wait = this.state.wait ? 'App wait' : 'App';

    return (
      <div className={wait}>
        <header className="App-header">
          <img
            src={evolveu}
            style={{ height: "40px" }}
            className="App-logo-evolveu"
            alt="logo"
          />
          <h1 className="App-title">
            Welcome {this.state.name} to EvolveU Progress Reporting
          </h1>
        </header>
        {body}
      </div>
    );
  }
}

export default App;
