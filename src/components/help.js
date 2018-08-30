import React from 'react';
import PropTypes from 'prop-types';

class Help extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

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

    return (
      <div className="backdrop" style={backdropStyle}>
        <div className="modal" style={modalStyle}>

<h1> How to fill in the sheet:</h1>
<ol>
<li>Awareness: You know it exists, what it is, where it fits, what it is used for, played with a simple example</li>
<li>Novice: Beginning to learn it; beginning to apply it; environment understood; limited experience; know where resources are</li>
<li>Intermediate: Able to solve basic problems on your own; using resource materials; gaining practical understanding</li>
<li>Theoretical: Able to apply theory and documentation to solve practical problems</li>
<li>Proficient / Skilled: With documentation, you can apply the skills to solve complex problems</li>
<li>Experienced able architect solutions and use in an efficient matter</li>
<li>Expert</li>
</ol>

          <div className="footer">
            <button onClick={this.props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
} 

Help.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Help;