import React, { Component } from 'react';
import './questions.css';

class Questions extends Component {

	constructor(props) {
	 	super(props);
	 	const values = props.questions.map((q,i) =>
	 		i+10
	 	)
	 	this.state = {
	 		values,
	 		total: this.totalValues(values),
	 	}
	}

	totalValues(array) {
		return array.reduce((total, num) => {
			var v = parseInt(num, 10);
			if (v > 5) v = 5;
			return total + v;
		}, 0);
	}

	isValid(value) {
		const i = parseInt(value,10);
		console.log(value,i);
		if (isNaN(i) || i < 0 || i > 7) {
			return false
		} else {
			return true;
		}
	}
	
	onQchange = (event, i) => {
		if (this.isValid(event.target.value)) {
			const values = this.state.values;
			values[i] = event.target.value;
			this.setState ({
				values,
		 		total: this.totalValues(values),
			});
		}
	}	

	onClick = (e) => {
		console.log('You freaking clicked me');
		const values = this.state.values;
		values[0] = 303;
		this.setState ({
			values,
		});
	}

  render() {
  	// console.log('render', this);

  	const questions = this.props.questions.map((q,i) =>
  		<tr key={i.toString()}>
  			<td className='right' >{q} :</td>
  			<td> <input onChange={(e) => this.onQchange(e,i)} id='{i.toString()}' value={this.state.values[i]} /> </td>
  		</tr>
  	);

    return (
      <div className="App">
      Hello World
      	<table className="centerTab">
      		<tbody>
	      		{questions}
      		</tbody>
      	</table>
      	The total is {this.state.total}
      	<button onClick={this.onClick} />
      	<button onClick={this.onClick} />
      </div>
    );
  }
}

export default Questions;
