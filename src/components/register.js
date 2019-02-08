import React, { Component } from "react";

class Register extends Component {

  onClick = e => {
    let name = document.getElementById("inName").value;
    // console.log("Just a clicked:", name);
    this.props.onRegister(name);
  };

  render() {
    return (
      <div>
        <br />
        <br />
        <br />
        <br />
        <h3 className="header"> Welcome</h3>
        <h3 className="header"> Please Confirm your name </h3>
        <input
          id="inName"
          style={{ width: "260px" }}
          defaultValue={this.props.name}
        />
        <br />
        <br />
        <button className="button" onClick={this.onClick}>Register</button>
      </div>
    );
  }
}

export default Register;
