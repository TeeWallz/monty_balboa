import React, { Component } from 'react';
import * as ReactGA from "react-ga";

// import { hot } from 'react-hot-loader';
// Import custom components
import Router from "./routers";

ReactGA.initialize('UA-75800811-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class AppContainer extends Component {
  render() {
    return <Router />;
  }
}

export default AppContainer;
