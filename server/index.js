const express = require('express');
const PORT = 3000;
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('hello world'));

app.post(
  '/logging', 
  (req, res) => {
    console.log(`You sent ${req.body.message}`);
  }
);

app.listen(PORT, () => console.log('Listening on port 3000.'));

