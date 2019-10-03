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
			exercise: "",
			is_help_open: false,
			is_learner_radar_chart_open: false,
			is_learner_line_chart_open: false,
			disable: allow_input ? "" : "disabled",

			compNo: '',
			predcompdate: '',
			industryproj: '',

		};

		this.onQchange = this.onQchange.bind(this);
		// this.updateServerScore = this.updateServerScore.bind(this);
	}

	componentDidMount = () => {
		// console.log('Questions.componentDidMount');
		fetch(process.env.REACT_APP_API + "/questions", { credentials: 'include' })
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
				// console.log('----data:', data);
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
					exercise: data.exercise,
					industryproj: data.industryproj,
					predcompdate: data.predcompdate,
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

	updateServerScore = (event, code) => {
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

	updateServerText = (event) => {
		// console.log('updateServerText', event.target.name, event.target.value);
		this.onHandleChange(event)
		this.updateServer("text", event.target.name, event.target.value);
	};

	onHandleChange = e => {
		// console.log("onHandleChange", e.target.name, e.target.value);
		this.setState({ [e.target.name]: e.target.value });
	}

	render() {
		// console.log('state', this.state);

		const wi = 100;

		const questions = this.state.questions.map((q, i) => (
			<tr key={i.toString()}>
				<td className="right">{q.question} :</td>
				<td>
					<input
						disabled={this.state.disable}
						style={{ width: "30px" }}
						onChange={e => this.onQchange(e, q.code)}
						onBlur={e => this.updateServerScore(e, q.code)}
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
				<div id="Competency">
					<table>
						<tbody>
							<tr>
								<td>
									What Competency # are you on?
							</td>
								<td>
									<select value={this.state.exercise}
										disabled={this.state.disable}
										name="exercise"
										onChange={this.updateServerText} >

										<option value="100">100 Comp 100 - JavaScript Basic Logic, Data Structures, and Best Practices</option>
										<option value="910">910 git</option>
										<option value="110">110 JavaScript TDD</option>
										<option value="120">120 JavaScript Events / DOM</option>
										<option value="130A">130A JavaScript OO - Account</option>
										<option value="130B">130B JavaScript OO - Account User Interface</option>
										<option value="130C">130C JavaScript OO - Account Controller & UI</option>
										<option value="920">920 Fetch API</option>
										<option value="130D">130D JavaScript OO - Community and City</option>
										<option value="130E">130E JavaScript OO - Object Reference</option>
										<option value="140">140 JavaScript Algorithms</option>
										<option value="150">150 ReactJS</option>
										<option value="160">160 Javascript Open API JSON (Optional)</option>
										<option value="170">170 JavaScript React Redux (Optional)</option>
										<option value="180">180 D3 (Optional)</option>
										<option value="198">198 Frontend Checklist</option>
										<option value="930">930 PostgresQL</option>
										<option value="200">200 Python - Getting Started - Logic</option>
										<option value="210">210 Python - Environment Conda</option>
										<option value="220">220 Python - File IO</option>
										<option value="230">230 Python - Excel</option>
										<option value="240">240 Python - Flask</option>
										<option value="250">250 Python - Full Stack</option>
										<option value="300">300 Java and OO Concepts</option>
										<option value="940">940 Heroku (Optional)</option>
										<option value="950">950 Docker (Optional)</option>
										<option value="298">298 Backend Checklist</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>
									Predicted Program Completion Date
							</td>
								<td>
									<input value={this.state.predcompdate}
										disabled={this.state.disable}
										type='date'
										name="predcompdate"
										onChange={this.onHandleChange}
										onBlur={this.updateServerText} />
								</td>
							</tr>
							{/* <tr>
								<td>
									Industry Project Requested
							</td>
								<td>
									<select value={this.state.industryproj}
										disabled={this.state.disable}
										name="industryproj"
										onChange={this.updateServerText}>
										<option value="true">Yes I would like an Industry project</option>
										<option value="false">I will continue learning or start working</option>
									</select>
								</td>
							</tr> */}
						</tbody>
					</table>
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
				<br />
				<div style={{ width: "100%", display: "flex" }}>
					<div style={{ height: "100px", width: "33%" }}>
						What is going well / accomplishments?
						<textarea
							disabled={this.state.disable}
							value={this.state.going_well}
							name="going_well"
							onChange={this.onHandleChange}
							onBlur={this.updateServerText}
							style={{ width: "90%", height: "80%" }}
						/>
					</div>
					<div style={{ height: "100px", width: "33%" }}>
						Issues or Concerns?
						<textarea
							disabled={this.state.disable}
							value={this.state.issues}
							name="issues"
							onChange={this.onHandleChange}
							onBlur={this.updateServerText}
							style={{ width: "90%", height: "80%" }}
						/>
					</div>
					<div style={{ height: "100px", width: "33%" }}>
						What should we try?
						<textarea
							disabled={this.state.disable}
							value={this.state.what_to_try}
							name="what_to_try"
							onChange={this.onHandleChange}
							onBlur={this.updateServerText}
							style={{ width: "90%", height: "80%" }}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Questions;
