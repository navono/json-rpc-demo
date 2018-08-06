import React, { Component } from 'react';
import * as ClientBrowser from 'jayson/lib/client/browser';
import * as axios from 'axios';
import logo from './logo.svg';
import './App.css';

// const ClientBrowser = client.browser;

class App extends Component {
  componentDidMount() {
    this.callServer = (request, callback) => {

      const options = {
        port: 3003,
        method: 'POST',
        // body: request, // request is a string
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      };

      const reqAscii = [];
      const length = request.length - 1;
      for(let i = 1; i < length; i++) {
          const code = request.charCodeAt(i);
          // Since charCodeAt returns between 0~65536, simply save every character as 2-bytes
          // result.push(code & 0xff00, code & 0xff);
          reqAscii.push(code);
      }

      const buf = new Buffer(reqAscii);
      options.body = new Buffer(buf);
      console.log(options);
      fetch('http://localhost:3003/rpc', options)
        .then(function(res) { return res.text(); })
        .then(function(text) { callback(null, text); })
        .catch(function(err) { callback(err); });
    };
  }

  handleClick = (e) => {
    console.log(ClientBrowser);
    
    const client = ClientBrowser(this.callServer);
    const req = client.request('HelloService.Say', {Who: "ping", Age: 18}, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(result);
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <input type='button' value={'RPC request'} onClick={this.handleClick}/>
      </div>
    );
  }
}

export default App;
