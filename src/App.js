/*

EvolveU: Colors

blue #42a0bc / rgb(66, 160, 188)
green #97c444 / rgb(151, 196, 68)


*/

import React, { Component } from 'react';
import evolveu from './EvolveU.jpeg';
import Questions from './components/questions/questions';
import Register from './components/register';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      questions: [],
      results: [],
      uuid: '',
      name: '',
      id: '',
    }
  }


  componentDidMount = () => {
    // fetch('http://localhost:5000/questions')
    fetch(process.env.REACT_APP_API + '/questions')
      .then(response => response.json())
      .then(data=> {
        this.setState({questions: data})
      })
      .catch(err => console.log(err));
  }

  onRegister = (event) => {
    const uuid = event.target.value;
    // console.log('We have a register...', event)
    fetch(process.env.REACT_APP_API + '/register/' + uuid)
      .then(response => response.json())
      .then(data=> {
        console.log(data);
        if ('id' in data) {
          this.setState({
            uuid: uuid,
            id: data.id,
            name: data.name,
          })
      }
      })
      .catch(err => console.log(err));
    // this.setState({input: event.target.value});
  }


  render() {

    let body;
    if (this.state.uuid === '') {
      body = <Register onRegister={this.onRegister}/>;
    } else {
      body = <Questions uuid={this.state.uuid}/>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={evolveu} style={{height: "40px"}} className="App-logo-evolveu" alt="logo" />
          <h1 className="App-title">Welcome {this.state.name} to EvolveU Evaluation Criteria</h1>
        </header>
        {body}
      </div>
    );
  }
}

export default App;
