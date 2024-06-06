const http = require('http');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const EventEmitter = require('events');

// Define/extend an EventEmitter class
class MyEmitter extends EventEmitter {};
// Initialize a new emitter object
const myEmitter = new MyEmitter();

// Directory for log files
const logDir = path.join(__dirname, 'logs');

// Ensure the logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Function to write log to a daily file
const writeLogToFile = (message) => {
  const date = new Date();
  const dateString = format(date, 'yyyy-MM-dd');
  const logFilePath = path.join(logDir, `${dateString}.log`);
  const logMessage = `${format(date, 'yyyy-MM-dd HH:mm:ss')} - ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write log to file:', err);
    }
  });
};

// Function to log events
const logEvent = (type, message) => {
  const fullMessage = `${type} Event: ${message}`;
  console.log(fullMessage);
  writeLogToFile(fullMessage);
};

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
      filePath += '/404.html'; // Ensure you have a 404.html file for not found pages
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.write('<h1>Server Error</h1>');
      res.end();

      // Emit an error event
      myEmitter.emit('error', '500 Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();

      // Emit an event for a successful file read
      myEmitter.emit('fileRead', filePath);
    }
  });

  // Emit an event for route access
  if (url !== '/') {
    myEmitter.emit('routeAccessed', url);
  }
});

// Listen for events
myEmitter.on('error', (message) => {
  logEvent('Error', message);
});

myEmitter.on('fileRead', (filePath) => {
  logEvent('File Read', `Successfully read file at ${filePath}`);
});

myEmitter.on('routeAccessed', (route) => {
  logEvent('Route Accessed', `${route} was accessed`);
});

server.listen(3000, () => {
  logEvent('Server', 'Server is listening on port 3000');
});