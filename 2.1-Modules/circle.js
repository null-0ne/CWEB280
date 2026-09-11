// circle.js

// Using CommonJS "exports"

const { PI } = Math;
// exports.area = (r) => PI * r ** 2;
// exports.circumference = (r) => 2 * PI * r;

// Using ES Modules
export const area = (r) => PI * r ** 2;
export const circumference = (r) => 2 * PI * r;