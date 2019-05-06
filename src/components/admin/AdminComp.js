import React, { Component } from "react";
import "./AdminComp.css";


class AdminComp extends Component {
	constructor(props) {
		super(props);
		// console.log('Props:', this.props)
		this.students = {};
		this.names = {};
		this.names_by_id = [];
		this.dates = {};
		this.weeks = [];
		this.state = {
			count: 0,
			students: this.students,
		}
	}

	componentDidMount = () => {
		// console.log('Questions.componentDidMount');
		fetch(process.env.REACT_APP_API + "/all", {
			method: "post",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: JSON.stringify({
				user_token: this.props.user_token,
			})
		})
			.then(response => response.json())
			.then(data => {
				// const r = data[0]
				// console.log('-Just the first-', r)
				// console.log(data)
				data.forEach((r, i, x) => {
					if (!(r.student_id in this.students)) {
						this.students[r.student_id] = {};
						this.names[r.student_id] = r.student;
						this.names_by_id.push(r.student_id);
					}
					this.students[r.student_id][r.date] = r;
					if (!(r.date in this.dates)) {
						this.dates[r.date] = "";
					}
				});
				this.weeks = Object.keys(this.dates).sort();
				this.names_by_id.sort((a,b) => {
					return this.names[a] > this.names[b] ? 1 : -1;
				})

				// console.log("Weeks:", this.weeks);
				// console.log("Students_by_id", this.names_by_id);
				this.setState({students: this.students});
			})
			.catch(err => console.log(err));
	};

	onButton = () => {
		this.setState( {count: this.state.count + 1});
	}

	formatStuff(s,w) {
		const r = this.students[s][w];
		const v = r ? r.exercise : "";

		return (<td key={w}> {v} </td>);
	}

	render() {
		// console.log('render -- this.Students:', this.students);
		// console.log('render -- keys:', Object.keys(this.students));
		const weeks = this.weeks.map(w => (<th key={w}> {w} </th>));
		// const weeks = 'week';

		const students = this.names_by_id.map((s,i,x) => {
			// console.log('render ---', s);
			return (
				<tr key={s}>
					<td>{s}</td><td>{this.names[s]}</td>
					{this.weeks.map(w => this.formatStuff(s,w))}
				</tr>
			)
		})
		// console.log('render -- Students:', students);
		return (
			<div>
				<h1> From the new component {this.state.count}</h1>
    			<h1 onClick={this.props.offAdmin}>Return from Admin Functions</h1>

    			<table>
    				<thead>
    					<tr>
    						<th>first</th>
    						<th>Second</th>
    					</tr>
    				</thead>
    				<tbody>
    					<tr>
    						<td>first</td>
    						<td>Second</td>
    					</tr>
    				</tbody>
    			</table>

    			<table>
	    			<thead>
						<tr>
							<th scope="col">ID</th>
							<th scope="col">Name</th>
							{weeks}
						</tr>
	    			</thead>
					<tbody className="scroll_tbody">
						{students}
					</tbody>
    			</table>
				<button onClick={this.onButton}> refresh </button>
			</div>

		)
	}
}

export default AdminComp;
