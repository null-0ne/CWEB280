// square.js

// Using CommonJS "exports"
//module.exports = class Square {

// Using ES Modules
export default class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
}
