const fs = require('fs'); // for image upload file handling

const express = require('express');

const app = express();

const port = 3300;
const host = 'localhost';
const serverPath = '/';
const staticPath = '/';

let staticFilePath = __dirname + serverPath;
// remove trailing slash if present
if (staticFilePath.substr(-1) === '/') {
  staticFilePath = staticFilePath.substr(0, staticFilePath.length - 1);
}

app.configure(() => {
  // compress static content
  app.use(express.compress());
  app.use(serverPath, express.static(staticFilePath)); // serve static files

  app.use(express.bodyParser()); // for post content / files - not sure if this is actually necessary?
});

// catch all route to serve index.html (main frontend app)
app.get('*', (req, res) => {
  res.sendfile(`${staticFilePath + staticPath}index.html`);
});

app.listen(port);

console.log(`Server running at http://${host}:${port.toString()}/`);
