import React, { Component } from "react";
import GoogleLogin from 'react-google-login'; 

class SignIn extends Component {
  constructor() {
    super();
    this.count = 0;
    // console.log("in SignIn constructor", this);
  }

  onGet = e => {
    // console.log("Just a onGet");
    // const token = localStorage.getItem('token');
    // console.log("Just a onGet", token);
    fetch(process.env.REACT_APP_API + "/whoami", {credentials: 'include'})
      .then(response => response.text())
      .then(text => console.log(text));
  };

  onSet = e => {
    this.count ++;
    // console.log("Just a onSet", this.count, this, );
    localStorage.setItem('token', "Some Real Cool Thing " + this.count);
  };

  onClear = e => {
    // console.log("Just a onClear");
    localStorage.removeItem('token');
  };

  render() {
    return (
      <div>
        <br />
        <br />
        <br />
        <br />
        <GoogleLogin
          clientId="225894951024-d2b5jugscfmfsp8fr6vd5mqhfl5si3uq.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={this.props.onGoogleSignonSuccess}
          onFailure={this.props.onGoogleSignonFail}
        />
{/*
        <br />
        <br />
        <h3 className="header"> Please enter your UUID (will be deprecated)</h3>
        <input
          style={{ width: "260px" }}
          onBlur={e => this.props.onSignin(e)}
        />
        <br />
        <br />
        <button className="button">SignIn</button>
        <br />
        <br />

        <button className="button" onClick={this.onSet}>Set</button>
        <button className="button" onClick={this.onGet}>Get</button>
        <button className="button" onClick={this.onClear}>Clear</button>
*/}
      </div>
    );
  }
}

export default SignIn;
