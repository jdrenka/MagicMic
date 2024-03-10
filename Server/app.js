//Requires and uses
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '../client')));

//Gets 
app.get('/', (req, res) => {
  res.redirect('Client/index.html');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});