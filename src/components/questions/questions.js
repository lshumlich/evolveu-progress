import React, { Component } from "react";
import "./questions.css";
import Help from "../help";
import LearnerRadarChart from "../graphs/learner-radar-chart";
// import LearnerLineChart from '../graphs/learner-line-chart';

class Questions extends Component {
	constructor(props) {
		super(props);
		const allow_input = false;
		this.state = {
			isValid: [],
			total: 0,
			stretch_total: 0,
			results: [],
			questions: [],
			last_monday: "",
			this_monday: "",
			next_monday: "",
			going_well: "",
			issues: "",
			what_to_try: "",
			is_help_open: false,
			is_learner_radar_chart_open: false,
			is_learner_line_chart_open: false,
			disable: allow_input ? "" : "disabled"
		};

		this.onQchange = this.onQchange.bind(this);
		this.onQBlur = this.onQblur.bind(this);
	}

	componentDidMount = () => {
		// console.log('Questions.componentDidMount');
		fetch(process.env.REACT_APP_API + "/questions", {credentials: 'include'})
			.then(response => response.json())
			.then(data => {
				const isValid = {};
				const results = this.state.results;
				data.map((q, i, x) => {
					isValid[q.code] = true;
					results[q.code] = "0";
					return 0;
				});
				this.setState({
					results,
					isValid,
					questions: data
				});
			})
			.catch(err => console.log(err));
		this.getResults("");
	};

	getResults = date => {
		// console.log('Questions.getResults');

		fetch(process.env.REACT_APP_API + "/results/" + date, {
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
			// console.log(data);
			// const results = this.state.results;
			// const isValid = this.state.isValid;
			const results = {};
			const isValid = {};

			this.state.questions.forEach(value => {
				results[value.code] = 0;
				isValid[value.code] = true;
			});

			if (data.results) {
				Object.keys(data.results).forEach(value => {
					// console.log('--- adding a result', value, data.results[value])
					results[value] = data.results[value];
				});
			}
			// console.log(data);
			// console.log(results);
			// console.log(isValid);
			// console.log(data.allow_input);
			const totals = this.totalValues(results, isValid);
			this.setState({
				results,
				isValid,
				last_monday: data.last_monday,
				this_monday: data.this_monday,
				next_monday: data.next_monday,
				going_well: data.going_well,
				issues: data.issues,
				what_to_try: data.what_to_try,
				total: totals.total,
				stretch_total: totals.stretch_total,
				disable: data.allow_input ? "" : "disabled"
			});
		})
		.catch(err => console.log(err));
	};

	changeMonday = monday => {
		// console.log('changeMonday', monday);
		this.getResults(monday);
	};

	toggleHelpModal = () => {
		this.setState({
			is_help_open: !this.state.is_help_open
		});
	};

	toggleLearnerRadarChartModal = () => {
		// console.log("toggleLearnerRadarChartModal");
		this.setState({
			is_learner_radar_chart_open: !this.state.is_learner_radar_chart_open
		});
	};

	toggleLearnerLineChartModal = () => {
		// console.log("toggleLearnerRadarChartModal");
		this.setState({
			is_learner_line_chart_open: !this.state.is_learner_line_chart_open
		});
	};

	totalValues(map, isValid) {
		let total = 0,
			stretch_total = 0;

		Object.keys(map).forEach(value => {
			if (isValid[value]) {
				var v = parseInt(map[value], 10),
					s = 0;
				if (v > 5) {
					s = v - 5;
					v = 5;
				}
				total += v;
				stretch_total += s;
			}
		});
		return {
			total: total,
			stretch_total: stretch_total
		};
	}

	maxPoints(value) {
		return value > 5 ? 5 : value;
	}

	isValid(value) {
		if (value.length !== 1) {
			return false;
		}
		const i = parseInt(value, 10);
		if (isNaN(i) || i < 0 || i > 7) {
			return false;
		} else {
			return true;
		}
	}

	onQchange = (event, code) => {
		const isValid = this.state.isValid;
		isValid[code] = this.isValid(event.target.value);
		this.setState({
			isValid
		});
		const results = this.state.results;
		results[code] = event.target.value;
		const totals = this.totalValues(results, isValid);
		this.setState({
			results,
			total: totals.total,
			stretch_total: totals.stretch_total
		});
		this.styleInput(event.target, isValid[code]);
	};

	onQblur = (event, code) => {
		// console.log(code, event.target.value);
		// console.log('---should we change it', this.state.results[code]);
		const isValid = this.state.isValid;
		isValid[code] = this.isValid(event.target.value);
		this.setState({
			isValid
		});

		if (isValid[code]) {
			this.updateServer("score", code, event.target.value);
		}
		this.styleInput(event.target, isValid[code]);
	};

	styleInput = (target, isValid) => {
		if (isValid) {
			target.style.background = "White";
		} else {
			target.style.background = "Red";
		}
	};

	updateServer = (type, code, value) => {
		fetch(process.env.REACT_APP_API + "/update", {
			method: "post",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: JSON.stringify({
				user_token: this.props.user_token,
				type: type,
				code: code,
				value: value,
				date: this.state.this_monday
			})
		}).then(res => res.json());
		// .then(res => console.log(res));
	};

	onTextChange = (event, code) => {
		// console.log('onTextChange', code, event.target.value);
		this.updateServer("text", code, event.target.value);
	};

	onGoingWell = event => {
		this.setState({ going_well: event.target.value });
	};

	onIssues = event => {
		this.setState({ issues: event.target.value });
	};

	onWhatToTry = event => {
		this.setState({ what_to_try: event.target.value });
	};

	onClick = e => {
		// console.log("Just a click");
		// window.open(process.env.REACT_APP_API + "/progress/" + this.state.this_monday + "/", "_blank");
		// console.log('0',this.maxPoints(0));
		// console.log('5',this.maxPoints(5));
		// console.log('7',this.maxPoints(7));
	};
	// value={this.state.results[q.code]}

	render() {
		// console.log('render results', this);

		const wi = 100;

		const questions = this.state.questions.map((q, i) => (
			<tr key={i.toString()}>
				<td className="right">{q.question} :</td>
				<td>
					<input
						disabled={this.state.disable}
						style={{ width: "30px" }}
						onChange={e => this.onQchange(e, q.code)}
						onBlur={e => this.onQblur(e, q.code)}
						id="{i.toString()}"
						value={this.state.results[q.code]}
					/>
				</td>
				<td>
					<div
						style={{
							width: wi + "px",
							height: "15px",
							outline: "solid"
						}}
					>
						{this.state.isValid[q.code] ? (
							<div
								style={{
									width:
										(wi / 5) * (this.state.results[q.code] > 5 ? 5 : this.state.results[q.code]) +
										"px",
									height: "15px",
									background: "blue"
								}}
							>
								{" "}
							</div>
						) : (
							<div />
						)}
					</div>
				</td>
			</tr>
		));

		return (
			<div className="questions">
				<div>
					<Help
						show={this.state.is_help_open}
						onClose={this.toggleHelpModal}
					/>

					<LearnerRadarChart
						show={this.state.is_learner_radar_chart_open}
						onClose={this.toggleLearnerRadarChartModal}
						questions={this.state.questions}
						results={this.state.results}
					/>
				</div>
				<div style={{ width: "100%" }}>
					{this.state.last_monday !== "" && (
						<div style={{ float: "left" }}>
							<button
								className="button"
								onClick={() =>
									this.changeMonday(this.state.last_monday)
								}
							>
								{" "}
								Prev{" "}
							</button>
						</div>
					)}
					<div style={{ float: "right" }}>
						<button
							className="button"
							onClick={this.toggleHelpModal}
						>
							{" "}
							Help{" "}
						</button>
					</div>

					<div style={{ float: "right" }}>
						<button
							className="button"
							onClick={this.props.onSignout}
						>
							{" "}
							Sign out{" "}
						</button>
					</div>

					<div style={{ float: "right" }}>
						<button
							className="button"
							onClick={this.toggleLearnerRadarChartModal}
						>
							{" "}
							Radar{" "}
						</button>
					</div>

					{this.state.next_monday !== "" && (
						<div style={{ float: "right" }}>
							<button
								className="button"
								onClick={() =>
									this.changeMonday(this.state.next_monday)
								}
							>
								{" "}
								Next{" "}
							</button>
						</div>
					)}

					<div>
						{this.state.last_monday} (--{" "}
						<strong className="header">
							{" "}
							{this.state.this_monday}{" "}
						</strong>{" "}
						--) {this.state.next_monday}
					</div>
				</div>
				<table className="centerTab">
					<tbody>
						<tr>
							<td className="right">
								{" "}
								<h3>Base Total / Stretch Total </h3>
							</td>
							<td>
								{" "}
								<h3>
									{this.state.total} /{" "}
									{this.state.stretch_total}{" "}
								</h3>{" "}
							</td>
						</tr>
						{questions}
					</tbody>
				</table>
				<div style={{ width: "100%", display: "flex" }}>
					<div style={{ height: "100px", width: "33%" }}>
						What is going well / accomplishments?
						<textarea
							value={this.state.going_well}
							onChange={this.onGoingWell}
							onBlur={e => this.onTextChange(e, "going_well")}
							style={{ width: "90%", height: "80%" }}
						/>
					</div>
					<div style={{ height: "100px", width: "33%" }}>
						Issues or Concerns?
						<textarea
							value={this.state.issues}
							onChange={this.onIssues}
							onBlur={e => this.onTextChange(e, "issues")}
							style={{ width: "90%", height: "80%" }}
						/>
					</div>
					<div style={{ height: "100px", width: "33%" }}>
						What should we try?
						<textarea
							value={this.state.what_to_try}
							onChange={this.onWhatToTry}
							onBlur={e => this.onTextChange(e, "what_to_try")}
							style={{ width: "90%", height: "80%" }}
						/>
					</div>
				</div>
{/*
				<button onClick={this.onClick}> Check </button>
				<button onClick={this.onClick} />
				<br/>
				<a href="http://localhost:8000/progress/2019-02-04/">Progress Report</a>
*/}								
			</div>
		);
	}
}

export default Questions;
