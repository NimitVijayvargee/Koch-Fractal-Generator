// Elements
const canvas = document.querySelector(".drawing-canvas");
const kochButton = document.querySelector(".koch-iterate");
const iterationCount = document.querySelector(".iteration-count");
const kochResetButton = document.querySelector(".koch-reset");
const kochIterateReverse = document.querySelector(".koch-iterate-reverse");

// Koch randomization
const max = 4; // max element in the koch array
const min = 0; // min element in the koch array
let kochIndex = Math.floor(Math.random() * (max - min + 1) + min);

// Setting dimensions of the canvas
canvas.width = 500;
canvas.height = 500;

const c_width = canvas.width;
const c_height = canvas.height - 250;

const ctx = canvas.getContext("2d");

// Keep track of the iterations
// Lines tracker is an array with all of the iterations in order
let linesTracker = [];

// Line class, used to define lines with a starting point A and ending point B, and given segment length
class Line {
  constructor(a, b, length) {
    this.start = a;
    this.end = b;
    this.segLength = length;
  }

  // Not necessary to calculate point A and E. They are given upon initiation of the Line object

  // Point B is 1/3 of the way
  calculatePointB(a, b) {
    this.pointB = new Point(
      (2 / 3) * a[0] + (1 / 3) * b[0],
      a[1] === b[1] ? b[1] : (2 / 3) * a[1] + (1 / 3) * b[1] // if the points are on the same y-height then keep height the same
    );
    return this.pointB;
  }

  // Point C
  // This is the midpoint of the line AB
  // It is set at some perpendicular distance R from line AB, this distance is equivalent to the height
  // The height of the equilateral triangle is given by h = (√3/2)AB where AB = length of the line
  calculatePointC(a, b) {
    // Midpoint
    const midX = (a[0] + b[0]) / 2;
    const midY = (a[1] + b[1]) / 2;

    // Direction vector
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];

    // Length of AB
    const lengthAB = Math.sqrt(dx * dx + dy * dy);

    // Height of the triangle
    const height = (lengthAB * Math.sqrt(3)) / 2 / 3;
    // Divided by 3 at the end because the side length of the equilateral triangle is 1/3rd the distance of line AB

    // Perpendicular unit vector
    const unitDx = -dy / lengthAB;
    const unitDy = dx / lengthAB;

    // Point C coordinates
    const x_C = midX + height * unitDx;
    const y_C = midY + height * unitDy;

    this.pointC = new Point(x_C, y_C);
    return this.pointC;
  }

  // Point D is 2/3rd of the way
  calculatePointD(a, b) {
    this.pointD = new Point(
      (1 / 3) * a[0] + (2 / 3) * b[0],
      a[1] === b[1] ? b[1] : (1 / 3) * a[1] + (2 / 3) * b[1] // if the points are on the same y-height then keep height the same
    );
    return this.pointD;
  }
}

// Class for defining a point
class Point {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

let lines = [];
let generation = 0; // Keeping track of the generations

// Drawing the initial triangle at the origin
const drawKochCurve = function (width) {
  // Draw a line
  lines.push(
    new Line(
      [c_width / 2 - width / 2, c_height / 2],
      [c_width / 2 + width / 2, c_height / 2],
      360
    )
  );
  ctx.beginPath();

  ctx.moveTo(lines[0].start[0], lines[0].start[1]);
  ctx.lineTo(lines[0].end[0], lines[0].end[1]);
  ctx.stroke();

  // line 2
  lines.push(
    new Line(
      [c_width / 2 - width / 2, c_height / 2],
      [c_width / 2, c_height / 2 + (Math.sqrt(3) / 2) * 360],
      360
    )
  );
  ctx.moveTo(lines[1].end[0], lines[1].end[1]);
  ctx.lineTo(lines[1].start[0], lines[1].start[1]);
  ctx.stroke();

  // line 3
  lines.push(
    new Line(
      [c_width / 2 + width / 2, c_height / 2],
      [c_width / 2, c_height / 2 + (Math.sqrt(3) / 2) * 360],
      360
    )
  );
  ctx.moveTo(lines[2].start[0],
