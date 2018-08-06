const jayson = require('jayson');
const fetch = require('node-fetch');

const option = {
  port: 3003,
  method: 'POST',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
};

// create a client
const client = jayson.client.http(option);
const req = client.request('HelloService.Say', {Who: "ping", Age: 18});

// For match Gorilla rpc specification
const paramsList = [];
paramsList.push(req.params);
req.params = paramsList;
const reqStr = JSON.stringify(req);
// console.log('reqStr', reqStr);
const reqAscii = [];
for(let i = 0, length = reqStr.length; i < length; i++) {
    const code = reqStr.charCodeAt(i);
    // Since charCodeAt returns between 0~65536, simply save every character as 2-bytes
    // result.push(code & 0xff00, code & 0xff);
    reqAscii.push(code);
}

const buf = new Buffer(reqAscii);
option.body = new Buffer(buf);
console.log(option);

fetch('http://localhost:3003/rpc', option)
  .then(function(res) { return res.text(); })
  .then(function(text) { 
    const response = JSON.parse(text);
    console.log(response.result); })
  .catch(function(err) { console.error(err); });
