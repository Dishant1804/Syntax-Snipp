const express = require('express');
const apiV1 = require('./api/v1/route');

const app = express();

app.use(express.json());

app.use('/api/v1', apiV1);

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})