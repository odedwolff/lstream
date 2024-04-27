const express = require('express');

const app = express();

// Define the port to listen on
const port = 3000;

// Simple route that responds with "Hello World!"
app.get('/', (req, res) => {
  res.send('Santo Cello!');
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});