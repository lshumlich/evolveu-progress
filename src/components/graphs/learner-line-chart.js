import React from "react";
// import LineChart from 'react-d3-components';
// import Brush from 'react-d3-components';

var LineChart = ReactD3.LineChart;
var Brush = ReactD3.Brush;

class Learner_line_chart extends React.Component {
  generateData = () => {
    console.log(this.props);
    const questions = this.props.questions;
    const results = this.props.results;
    const variables = [],
      my_values = {},
      target_values = {};

    questions.forEach(value => {
      variables.push({ key: value.code, label: value.code });
      my_values[value.code] = results[value.code];
      target_values[value.code] = 5;
    });

    const sets = [];
    sets.push({ key: "mine", label: "Mine", values: my_values });
    sets.push({ key: "target", label: "Target", values: target_values });

    const data = { variables: variables, sets: sets };

    return data;
  };

  getData = () => {
    return {
      data: {
        label: "",
        values: [
          { x: new Date(2015, 2, 5), y: 1 },
          { x: new Date(2015, 2, 6), y: 2 },
          { x: new Date(2015, 2, 7), y: 0 },
          { x: new Date(2015, 2, 8), y: 3 },
          { x: new Date(2015, 2, 9), y: 2 },
          { x: new Date(2015, 2, 10), y: 3 },
          { x: new Date(2015, 2, 11), y: 4 },
          { x: new Date(2015, 2, 12), y: 4 },
          { x: new Date(2015, 2, 13), y: 1 },
          { x: new Date(2015, 2, 14), y: 5 },
          { x: new Date(2015, 2, 15), y: 0 },
          { x: new Date(2015, 2, 16), y: 1 },
          { x: new Date(2015, 2, 16), y: 1 },
          { x: new Date(2015, 2, 18), y: 4 },
          { x: new Date(2015, 2, 19), y: 4 },
          { x: new Date(2015, 2, 20), y: 5 },
          { x: new Date(2015, 2, 21), y: 5 },
          { x: new Date(2015, 2, 22), y: 5 },
          { x: new Date(2015, 2, 23), y: 1 },
          { x: new Date(2015, 2, 24), y: 0 },
          { x: new Date(2015, 2, 25), y: 1 },
          { x: new Date(2015, 2, 26), y: 1 }
        ]
      }
    };
  };

  render() {
    // console.log('In Learner_radar_chart.render()', this);

    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }
    const data2 = this.generateData();
    console.log(data2);

    // The gray background
    const backdropStyle = {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      textAlign: "left",
      backgroundColor: "#fff",
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: "0 auto",
      padding: 30
    };

    return (
      <div style={backdropStyle}>
        <div style={modalStyle}>
          <h1>Learner Line Chart v.1</h1>
          <div style={{ float: "right" }}>
            <button className="button" onClick={this.props.onClose}>
              {" "}
              Close{" "}
            </button>
          </div>

          <div>
            <LineChart
              data={this.getData()}
              width={400}
              height={400}
              margin={{ top: 10, bottom: 50, left: 50, right: 20 }}
            />
            <div className="brush" style={{ float: "none" }}>
              <Brush
                width={400}
                height={50}
                margin={{ top: 0, bottom: 30, left: 50, right: 20 }}
                extent={[new Date(2015, 2, 10), new Date(2015, 2, 12)]}
                onChange={this._onChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Learner_line_chart;
