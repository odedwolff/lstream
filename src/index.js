const express = require('express');
const path = require('path');
const caller = require('./GeminiAPI/caller')
const bodyParser = require('body-parser'); // Import body-parser



const app = express();

// Define the port to listen on
const port = process.env.LSTREAM_PORT || 3000;


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..','public')));

app.use(bodyParser.json());


// Simple route that responds with "Hello World!"
app.get('/hello', (req, res) => {
  res.send('Santo Cello!');
});

app.get('/ajaxTest', (req, res) => {
    res.send('ajaxResponse!');
  });



app.post('/postTest', (req, res) => {
  // Access data from the request body
  const data = req.body;

  // Perform some logic on the received data (optional)
  console.log("Received data:", data);

  // Prepare response data as a JavaScript object
  /* const responseData = {
    message: "Data received successfully!",
    data: data // Echo back the received data
  }; */

  const responseData = {resPar1:"val1", resPar2:"val2"};

  // Set the response status code and send the JSON response
  res.status(200).json(responseData);
});


  app.get('/simpleCycleOld', (req, res) => {
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

  app.post('/simpleCycle', (req, res) => {
    const data = req.body;
    console.log("Received data:", data);
    const language = data.lang;
    const level = data.level;
    const maxLen = data.maxLen;
    //const level = 'A2';

    var retObj = caller.simpleCycleTest(language, level, maxLen)
    retObj.then(
      function(inRet){
            res.send(JSON.stringify(inRet));
      }, 
      function(err){
        console.log(`ERROR: ${err}`);
        res.status(500).json({ message: 'Internal Server Error' });
      }

    );
    //res.send('simpleCycleResponse!');
    //res.send(JSON.stringify(retObj));
  });




// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});