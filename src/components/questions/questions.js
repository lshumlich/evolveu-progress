
import React, { Component } from 'react';
import './questions.css';
import Help from '../help';

class Questions extends Component {

	constructor(props) {
	 	super(props);
	 	// console.log('Questions.constructor running');
	 	// const values = props.questions.map((q,i) =>
	 	// 	0
	 	// )
	 	// const isValid = props.questions.map((q,i) =>
	 	// 	true
	 	// )
	 	this.state = {
	 		isValid: [],
	 		total: 0,
	 		results: [],
	 		questions: [],
	 		last_monday: 'Start State',
	 		this_monday: 'Start State',
	 		next_monday: 'Start State',
	 		isOpen: false,
	 	}
	}

	componentDidMount = () => {
		// console.log('Questions.componentDidMount');
		fetch(process.env.REACT_APP_API + '/questions2')
		  .then(response => response.json())
		  .then(data=> {
		 	const isValid = {};
		 	const results = this.state.results;
		 	data.map((q,i,x) => {
		 		isValid[q.code] = true;
		 		results[q.code] = '0';
		 		return 0;
		 	})
		    this.setState({
		    	results,
		    	isValid,
		    	questions: data,
		    })
		  })
		  .catch(err => console.log(err));
		 this.getResults('');
	}

	getResults = (date) => {
		// console.log('Questions.getResults');
		fetch(process.env.REACT_APP_API + '/results/'+this.props.uuid+'/'+date)
		  .then(response => response.json())
		  .then(data => {
		  	// console.log(data);
		  	const results = this.state.results;
		  	const isValid = this.state.isValid;
		  	if (data.results) {
				Object.keys(data.results).forEach((value) => {  		
			  		// console.log('--- adding a result', value, data.results[value])
			  		results[value] = data.results[value];
			  	})
		  	}
		    this.setState({
		    	// results,
		    	last_monday: data.last_monday,
		    	this_monday: data.this_monday,
		    	next_monday: data.next_monday,
		    	total: this.totalValues(results, isValid),
		    })
		  })
		  .catch(err => console.log(err));
	}

	toggleModal = () => {
	    this.setState({
	      isOpen: !this.state.isOpen
	    });
	}

	totalValues(map, isValid) {
		let total = 0;
		Object.keys(map).forEach((value) => {
			if(isValid[value]) {
				var v = parseInt(map[value], 10);
				if (v > 5) v = 5;
				total += v;
			}
		})
		return total
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
	
	onQchange = (event, code) => {
		const isValid = this.state.isValid;
		isValid[code] = this.isValid(event.target.value)
		this.setState ({
			isValid,
		});
		const results = this.state.results;
		results[code] = event.target.value;
		this.setState ({
			results,
	 		total: this.totalValues(results, isValid),
		});
	}	

	onQblur = (event, code) => {
		// console.log(code, event.target.value);
		// console.log('---should we change it', this.state.results[code]);
		const isValid = this.state.isValid;
		isValid[code] = this.isValid(event.target.value)
		this.setState ({
			isValid,
		});
		if (isValid[code]) {
			event.target.style.background="White";
			// console.log('lets update:', code, event.target.value);
			this.updateServer('score', code, event.target.value);
		} else {
			event.target.style.background="Red";
		}
	}

	updateServer = (type, code, value) => {
		fetch(process.env.REACT_APP_API + '/update', {
  			method: 'post',
  			headers: {
    			'Accept': 'application/json, text/plain, */*',
    			'Content-Type': 'application/json'
  			},
  			body: JSON.stringify({'type': type, 'code': code, 'value': value, 'uuid': this.props.uuid, 'date': this.state.this_monday})
		})
			.then(res=>res.json());
  			// .then(res => console.log(res));
	}

	onTextChange = (event, code) => {
		console.log('onTextChange', code, event.target.value);
		this.updateServer('text', code, event.target.value);
	}


	onClick = (e) => {

		console.log('Just a click');
		const map = this.state.results;
		console.log(map);
		Object.keys(map).forEach((a) => console.log(a, map[a]))
	}

	changeMonday = (monday) => {
		console.log('changeMonday', monday);
	}

  render() {
  	// console.log('render results', this);

  	const wi = 100;

  	const questions = this.state.questions.map((q,i) =>
  		<tr key={i.toString()}>
  			<td className='right' >
  				{q.question} :</td>
  			<td> 
  				<input 
  					style={{width:"30px"}}
  					onChange={(e) => this.onQchange(e,q.code)} 
  					onBlur={(e) => this.onQblur(e,q.code)} 
  					id='{i.toString()}' 
  					value={this.state.results[q.code]} 
  				/> 
  			</td>
  			<td>
  				<div style={{width:wi+"px", height:"15px", outline:"solid"}}>
  					{this.state.isValid[q.code] ? <div style={{width:(wi/5*this.state.results[q.code])+"px", height:"15px", background:"blue"}}> </div>
  						: <div/>
  					} 
  				</div>
  			</td>
  		</tr>
  	);

    return (
      <div className="questions" >
      	<div>

	        <Help show={this.state.isOpen}
	          onClose={this.toggleModal}>
	        </Help>

      	</div>
      	<div style={{width:"100%"}}>
     		{ this.state.last_monday !== '' &&
	      		<div style={{float:"left"}}>
	      			<button class="button" onClick={() => this.changeMonday(this.state.last_monday)}> Prev </button>
	      		</div>
	      	}
      		<div style={{float:"right"}}>
      			<button class="button" onClick={this.toggleModal}> Help </button>
      		</div>
     		{ this.state.next_monday !== '' &&
	      		<div style={{float:"right"}}>
	      			<button class="button" onClick={() => this.changeMonday(this.state.next_monday)}> Next </button>
	      		</div>
	      	}
      		<div>
	      		{this.state.last_monday} (-- <strong class="header"> {this.state.this_monday} </strong> --) {this.state.next_monday}
      		</div>
      	</div>
      	<table className="centerTab">
      		<tbody>
	      		{questions}
	      		<tr>
	      			<td className='right'> <h3>The total is</h3></td>
	      			<td> <h3>{this.state.total} </h3> </td>
	      		</tr>
      		</tbody>
      	</table>
      	<div style={{width:"100%", display:"flex"}}>
	      	<div style={{height:"100px", width:"33%"}}>
	      		What is going well?
	      		<textarea onBlur={(e) => this.onTextChange(e,'going_well')} style={{width:"90%", height:"80%"}}></textarea>
	      	</div>
	      	<div style={{height:"100px", width:"33%"}}>
	      		Issues or Concerns?
	      		<textarea onBlur={(e) => this.onTextChange(e,'issues')} style={{width:"90%", height:"80%"}}></textarea>
	      	</div>
	      	<div style={{height:"100px", width:"33%"}}>
	      		What should we try?
	      		<textarea onBlur={(e) => this.onTextChange(e,'what_to_try')} style={{width:"90%", height:"80%"}}></textarea>
	      	</div>
	      </div>
      	<button onClick={this.onClick}> Check </button>
      	<button onClick={this.onClick} />
      </div>
    );
  }
}

export default Questions;
