import React, { Component } from 'react';
import logo from './logo.svg';
import evolveu from './EvolveU.jpeg';
import Questions from './components/questions/questions';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      questions: []
    }
  }


  componentDidMount = () => {
    // fetch('http://localhost:5000/questions')
    fetch(process.env.REACT_APP_API + '/questions')
      .then(response => response.json())
      .then(data=> {
        console.log(data)
        this.setState({questions: data})
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <img src={evolveu} style={{height: "40px"}} className="App-logo-evolveu" alt="logo" />
          <h1 className="App-title">Welcome to EvolveuU Evaluation Criteria.</h1>
        </header>
          <p className="App-intro">
            Each week, fill out the evaluation criteria.
          </p>
          <Questions questions={this.state.questions}/>
      </div>
    );
  }
}

export default App;
