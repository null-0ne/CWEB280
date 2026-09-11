// app.js

// Using CommonJS "require"
//const circle = require("./circle.js");

// Using ES Modules
import * as circle from "./circle.js";

console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);

// output circumference of radius 6

console.log(
  `The circumference of a circle of radius 6 is ${circle.circumference(6)}`,
);

// Using CommonJS "require"
//const square = require("./square.js");

// Using ES Modules
import Square from "./square.js";

const mySquare = new Square(2);

console.log(`The area of a square of width 2 is ${mySquare.area()}`);
