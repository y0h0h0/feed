import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';



class App extends Component {

  state = {
    page:'feed'
  }


  componentDidMount() {
    console.log('App mounted at ', window.location);
    console.log( process.env );
  }


  openFeed = () => this.setState({page:'feed'})
  openLogin = () => this.setState({page:'login'})


  render() {
    return (
      <div className="App">
        <div className="">
          <div onClick={this.openFeed}>Feed</div>
          <div onClick={this.openLogin}>Login</div>
        </div>

      </div>
    );
  }
}

export default App;
