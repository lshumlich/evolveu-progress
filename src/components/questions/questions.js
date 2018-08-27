
import React, { Component } from 'react';
import './questions.css';

class Questions extends Component {

	constructor(props) {
	 	super(props);
	 	const values = props.questions.map((q,i) =>
	 		i
	 	)
	 	const isValid = props.questions.map((q,i) =>
	 		true
	 	)
	 	this.state = {
	 		values,
	 		isValid,
	 		total: this.totalValues(values, isValid),
	 	}
	}

	totalValues(array, isValid) {
		return array.reduce((total, num, i) => {
			if(isValid[i]) {
				var v = parseInt(num, 10);
				if (v > 5) v = 5;
				return total + v;
			} else {
				return total;
			}
		}, 0);
	}

	isValid(value) {
		if (value.length !== 1) {
			return false;
		}
		const i = parseInt(value,10);
		if (isNaN(i) || i < 0 || i > 7) {
			return false;
		} else {
			return true;
		}
	}
	
	onQchange = (event, i) => {
		const isValid = this.state.isValid;
		isValid[i] = this.isValid(event.target.value)
		this.setState ({
			isValid,
		});
		const values = this.state.values;
		values[i] = event.target.value;
		this.setState ({
			values,
	 		total: this.totalValues(values, isValid),
		});
	}	

	onQblur = (event, i) => {
		const isValid = this.state.isValid;
		isValid[i] = this.isValid(event.target.value)
		this.setState ({
			isValid,
		});
		if (isValid[i]) {
			event.target.style.background="White";
		} else {
			event.target.style.background="Red";
		}
	}

	onClick = (e) => {
		console.log('Just a click');
	}


  render() {
  	// console.log('render', this);

  	const wi = 100;
  	const questions = this.props.questions.map((q,i) =>
  		<tr key={i.toString()}>
  			<td className='right' >{q} :</td>
  			<td> 
  				<input 
  					style={{width:"30px"}}
  					onChange={(e) => this.onQchange(e,i)} 
  					onBlur={(e) => this.onQblur(e,i)} 
  					id='{i.toString()}' 
  					value={this.state.values[i]} 
  				/> 
  			</td>
  			<td>
  				<div style={{width:wi+"px", height:"15px", outline:"solid"}}>
  					{this.state.isValid[i] ? <div style={{width:(wi/5*this.state.values[i])+"px", height:"15px", background:"blue"}}> </div>
  						: <div/>
  					}
  				</div>
  			</td>
  		</tr>
  	);

    return (
      <div className="questions" >
      	<table className="centerTab">
      		<tbody>
	      		{questions}
	      		<tr>
	      			<td className='right'> <h3>The total is</h3></td>
	      			<td> <h3>{this.state.total} </h3> </td>
	      		</tr>
      		</tbody>
      	</table>
      	<button onClick={this.onClick}> Check </button>
      	<button onClick={this.onClick} />
      </div>
    );
  }
}

export default Questions;
