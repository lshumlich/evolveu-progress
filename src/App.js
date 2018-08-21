import React, { Component } from 'react';
import logo from './logo.svg';
import Questions from './components/questions/questions';
import './App.css';
const questions = [
  'q1',
  'q2 asdf asdf asdf sdaf sdaf ',
  'q3',
  'q4',
  'q5'
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <Questions questions={questions}/>
      </div>
    );
  }
}

export default App;
