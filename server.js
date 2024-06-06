const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// Defn EventEmitter class
class MyEmitter extends EventEmitter {};

// Init emitter object
const myEmitter = new MyEmitter();

const server = http.createServer((req, res) => {
  const url = req.url;
  let filePath = './views';

  switch (url) {
    case '/about':
      filePath += '/about.html';
      break;
    case '/contact':
      filePath += '/contact.html';
      break;
    case '/products':
      filePath += '/products.html';
      break;
    case '/subscribe':
      filePath += '/subscribe.html';
      break;
    case '/':
      filePath += '/index.html';
      break;
    default:
      filePath += '/404.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.write('<h1>Server Error</h1>');
      res.end();

      // Emit error event
      myEmitter.emit('error', '500 Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();

      // Emit success event
      myEmitter.emit('fileRead', filePath);
    }
  });

  // Emit event for route access
  if (url !== '/') {
    myEmitter.emit('routeAccessed', url);
  }
});

// Listen 
myEmitter.on('error', (message) => {
  console.log(`Error Event: ${message}`);
});

myEmitter.on('fileRead', (filePath) => {
  console.log(`File Read Event: Successfully read file at ${filePath}`);
});

myEmitter.on('routeAccessed', (route) => {
  console.log(`Route Accessed Event: ${route} was accessed`);
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});