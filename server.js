const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
  
  switch (url) {
    case '/about':
      console.log('About page');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>About Page</h1>');
      break;

    case '/contact':
      console.log('Contact page');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Contact Page</h1>');
      break;

    case '/products':
      console.log('Products page');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Products Page</h1>');
      break;

    case '/subscribe':
      console.log('Subscribe page');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Subscribe Page</h1>');
      break;

    case '/':
      console.log('Home page');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Home Page</h1>');
      break;
      
    default:
      console.log('Page not found');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<h1>404 Page Not Found</h1>');
  }
  res.end();
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});