
import React, { Component } from 'react';

class Register extends Component {

  	render() {
  		return (
  			<div>
  				<h2 className="header"> Please enter your UUID </h2>
  				<input 
  					style={{width:"260px"}}
  					onBlur={(e) => this.props.onRegister(e)} 
  				/> 
  				<br/>
  				<br/>
  				<button className="button">Register</button>
  			</div>
  		);
	}	
}

export default Register;
