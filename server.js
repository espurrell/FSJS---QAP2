const http = require('http');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const EventEmitter = require('events');

// Defn class
class MyEmitter extends EventEmitter {};

// Initialize 
const myEmitter = new MyEmitter();

// Directory
const logDir = path.join(__dirname, 'logs');

// error handling
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Fn daily file
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

// Fn log events
const logEvent = (type, message) => {
  const fullMessage = `${type} Event: ${message}`;
  console.log(fullMessage);
  writeLogToFile(fullMessage);
};

// Fn for menu
const includeMenu = (htmlContent, callback) => {
  fs.readFile('./Views/Template/menu.html', 'utf8', (err, menuHtml) => {
    if (err) {
      callback(err, null);
    } else {
      const contentWithMenu = menuHtml + htmlContent;
      callback(null, contentWithMenu);
    }
  });
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
      filePath += '/404.html'; 
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.write('<h1>Server Error</h1>');
      res.end();

      // Emit an error event
      myEmitter.emit('error', '500 Internal Server Error');
    } else {
      includeMenu(data, (err, contentWithMenu) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.write('<h1>Server Error</h1>');
          res.end();
          logEvent('Error', `Failed to include menu: ${err.message}`);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(contentWithMenu);
          res.end();

          
          myEmitter.emit('fileRead', filePath);
        }
      });
    }
  });

  
  if (url !== '/') {
    myEmitter.emit('routeAccessed', url);
  }
});


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