import React, { Component } from "react";
import GoogleLogin from 'react-google-login'; 

class Register extends Component {
  render() {
    return (
      <div>
        <br />
        <br />
        <GoogleLogin
          clientId="225894951024-d2b5jugscfmfsp8fr6vd5mqhfl5si3uq.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={this.props.onGoogleSignonSuccess}
          onFailure={this.props.onGoogleSignonFail}
        />
        <br />
        <br />
        <h3 className="header"> Please enter your UUID (will be deprecated)</h3>
        <input
          style={{ width: "260px" }}
          onBlur={e => this.props.onRegister(e)}
        />
        <br />
        <br />
        <button className="button">Register</button>
      </div>
    );
  }
}

export default Register;
