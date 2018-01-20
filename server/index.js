const express = require('express');
const PORT = 3000;
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// For now, basic fetch to server to get intitial interval
// Eventually, we'd look this up for a user?
app.get(
  '/', 
  (req, res) => {
    res.send(
      {
        timeInterval: 1
      }
    );
  }
);

app.post(
  '/logging', 
  (req, res) => {
    console.log(`You sent ${req.body.message}`);
  }
);

app.listen(PORT, () => console.log('Listening on port 3000.'));

