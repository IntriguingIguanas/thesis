import React from 'react';
import { connect } from 'react-redux';

class App extends React.Component {
	constructor(props) {
		super(props);
	}

  render () {
	  return (<h1>Hello World!</h1>)
  }
}

const mapStateToProps = (state) => {
  return {

  }
}


export default connect(mapStateToProps)(App);