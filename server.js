const http = require('http');
const fs = require('fs');
const path = require('path');

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
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    }
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});