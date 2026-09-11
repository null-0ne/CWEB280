//app.js

//import express
const express = require("express");

const app = express(); //call express factory to create instance of app object
const port = 3000; //this means we listen at http://localhost:3000

//this means the path/route looks like http://localhost:3000/
app.get("/", (req, res) => {
  //req is the Request JS object made from data sent by the browser
  //res is the Response JS object which handles what to send back to the browser
  res.send("Hello World!");
  //res.render when we use templates like handlerbars
  //res.json when we make an api that returns JSON (not HTML)
});

//this means the path/route looks like http://localhost:3000/bob
app.get("/bob", (req, res) => {
  //req is the Request JS object made from data sent by the browser
  //res is the Response JS object which handles what to send back to the browser
  res.send("Hello Bob!");
  //res.render when we use templates like handlerbars
  //res.json when we make an api that returns JSON (not HTML)
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
