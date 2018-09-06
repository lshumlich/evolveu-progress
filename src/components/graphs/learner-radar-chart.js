import React from 'react';
import Radar from 'react-d3-radar';

class Learner_radar_chart extends React.Component {

  generateData = () => {
    console.log(this.props);
    const questions = this.props.questions;
    const results = this.props.results;
    const variables = [],
          my_values = {},
          target_values = {};
 
    questions.forEach((value) => {
      variables.push({'key': value.code, 'label': value.code});
      my_values[value.code] = results[value.code];
      target_values[value.code] = 5;
    })

    const sets = []
    sets.push({key:'mine', label:'Mine', values: my_values});
    sets.push({key:'target', label:'Target', values: target_values});

    const data = {variables: variables, sets: sets};
    
    return data;
  }




  render() {
    // console.log('In Learner_radar_chart.render()', this);


    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }
    // const data2 = this.generateData();
    // console.log(data2);


    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      textAlign: 'left',
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    };


    return(
<div style={backdropStyle}>
<div style={modalStyle}>
        <h1>Learner Radar Chart v.2</h1>
          <div style={{float:"right"}}>
            <button className="button" onClick={this.props.onClose}> Close </button>
          </div>


<Radar
  width={500}
  height={500}
  padding={70}
  domainMax={5}
  highlighted={null}
  onHover={(point) => {
    if (point) {
      console.log('hovered over a data point');
    } else {
      console.log('not over anything');
    }
  }}
  data={this.generateData()}
/>


</div>
</div>
)
  }

}

export default Learner_radar_chart;