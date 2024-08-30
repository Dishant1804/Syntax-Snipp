const express = require('express');


const app = express();

app.use(express());

app.get('/helloworld' , (_req, res) => {
  res.send("hello world")
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
