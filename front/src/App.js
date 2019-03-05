import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import {getPosts} from 'Api';


class App extends Component {

  state = {
    page:'feed'
  }


  componentDidMount() {
    console.log('App mounted at ', window.location);
    console.log( process.env );
    this.gettt();
  }

  gettt = async () => {
    let dam = await getPosts();
    console.log('dam', dam)
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
