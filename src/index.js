const express = require('express');
const path = require('path');
const caller = require('./GeminiAPI/caller')


const app = express();

// Define the port to listen on
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..','public')));

// Simple route that responds with "Hello World!"
app.get('/hello', (req, res) => {
  res.send('Santo Cello!');
});

app.get('/ajaxTest', (req, res) => {
    res.send('ajaxResponse!');
  });


  app.get('/simpleCycle', (req, res) => {
    const language = 'italian';
    const level = 'A2';
    var retObj = caller.simpleCycleTest(language, level)
    retObj.then(
      function(inRet){
            res.send(JSON.stringify(inRet));
      }

    );
    //res.send('simpleCycleResponse!');
    //res.send(JSON.stringify(retObj));
  });




// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});