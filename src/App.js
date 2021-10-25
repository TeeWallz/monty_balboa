import React, { Component } from 'react';
// import { hot } from 'react-hot-loader';

// Import custom components
import Router from "./routers";

class AppContainer extends Component {
  render() {
    function importAll(r) {
      return r.keys().map(r);
    }

    const images = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/));
    
    return <Router />;
  }
}

export default AppContainer;
