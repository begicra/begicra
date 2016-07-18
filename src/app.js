import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import Result from './components/result';

class App extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
	      <div class="container">
          container
	        <div class="row">
            row
	        	<div id="results"></div>
            result
	        </div>
	      </div>
        <Result />
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
