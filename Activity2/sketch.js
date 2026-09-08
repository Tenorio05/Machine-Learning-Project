// Seeking a Target (Seek)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/p1Ws1ZhG36g
// https://thecodingtrain.com/learning/nature-of-code/5.2-seek.html

// Seek: https://editor.p5js.org/codingtrain/sketches/AxuChwlgb
// Seek with Sliders: https://editor.p5js.org/codingtrain/sketches/DROTtSI7J
// Arrive: https://editor.p5js.org/codingtrain/sketches/dQx9oOfTN
// Pursue: https://editor.p5js.org/codingtrain/sketches/XbsgoU_of

let vehicle;
let target;
let targR;
let counter;
let seesTarget;

let arcX, arcY;
let arcS, arcE;
let arcD, arcA;
let arcHeading;

let margin, spacing;
let cols, rows;
let cellW, cellH;
let maxDiag, goForward;
let col, row;
let targX, targY;
let currTarget;
let foundNext;
let nextForward;
let nextCol, nextRow;

function setup() {
  createCanvas(windowWidth, windowHeight);// width, height);
  vehicle = new Vehicle(width/2, height/2);
  target = createVector(random(width), random(height));
  targR = 16;
  counter = 0;
  arcD = 200;
  arcA = QUARTER_PI;
}

function draw() {
  background(0);
  noStroke();
  textSize(24);

  // Seeking logic
  arcHeading = vehicle.vel.heading();
  arcS = arcHeading - arcA;
  arcE = arcHeading + arcA;
  arcX = vehicle.pos.x;
  arcY = vehicle.pos.y;
  
  vec = p5.Vector.sub(target, vehicle.pos);
  distance = p5.Vector.mag(vec);
  if (distance < targR) {
    target = createVector(random(width), random(height));
    counter += 1;
  }
  seesTarget = arcCollides(
    target.x, target.y, targR,
    arcX, arcY, arcD,
    arcHeading, arcA);
  
  if (seesTarget) vehicle.seek(target);
  else wander(vehicle);

  // Arc draw
  fill(0, 120, 0);
  arc(arcX, arcY, arcD, arcD, arcS, arcE, PIE);
  
  // Food draw
  fill(255, 0, 0);
  circle(target.x, target.y, targR*2);
  
  // Vehicle draw
  vehicle.update();
  vehicle.show();
  
  // Text draw
  fill(0, 0, 255);
  text("Food: " + counter, 50, 50);
}

function arcCollides(circX, circY, circD, arcX, arcY, arcD, arcHeading, arcHalfAngle) {
  
  // Distance verification
  let d = dist(circX, circY, arcX, arcY);
  if (d > circD/2 + arcD/2) {
    return false;
  }
  
  // Angle verification
  let ang = atan2(circY - arcY, circX - arcX);
  let diff = ang - arcHeading;
  
  while (diff < -PI) diff += TWO_PI;
  while (diff > PI) diff -= TWO_PI;
  
  if (abs(diff) <= arcA) {
    return true;
  }
  
  return false;
}

function wander(vehicle) {
  margin = 60;
  spacing = 120;

  // Defining cols and rows based on window size
  cols = max(2, floor((width - 2 * margin) / spacing));
  rows = max(2, floor((height - 2 * margin) / spacing));

  cellW = (width - 2 * margin) / (cols - 1);
  cellH = (height - 2 * margin) / (rows - 1);

  maxDiag = (cols - 1) + (rows - 1);

  // Condition to invert the cycle direction
  goForward = (vehicle.diagSum % 2 === 0);
  if (vehicle.invertCycle) {
    goForward = !goForward;
  }
  
  col = goForward ? vehicle.diagStep : vehicle.diagSum - vehicle.diagStep;
  row = goForward ? vehicle.diagSum - vehicle.diagStep : vehicle.diagStep;

  // Defining the current (col, row) target
  targX = margin + col * cellW;
  targY = margin + row * cellH;
  currTarget = createVector(targX, targY);

  // Making the vehicle seek for this target
  vehicle.seek(currTarget);

  // Checking on the distance between then
  if (p5.Vector.dist(vehicle.pos, currTarget) < 45) {
    foundNext = false;

    // Loop to find next target
    while (!foundNext && vehicle.diagSum <= maxDiag) {
      vehicle.diagStep++;
      
      if (vehicle.diagStep > vehicle.diagSum) {
        vehicle.diagSum++;
        vehicle.diagStep = 0;
      }

      if (vehicle.diagSum > maxDiag) break;

      nextForward = (vehicle.diagSum % 2 === 0);
      if (vehicle.invertCycle) nextForward = !nextForward;
      nextCol = nextForward ? vehicle.diagStep : vehicle.diagSum - vehicle.diagStep;
      nextRow = nextForward ? vehicle.diagSum - vehicle.diagStep : vehicle.diagStep;

      if (nextCol >= 0 && nextCol < cols && nextRow >= 0 && nextRow < rows) foundNext = true;
    }

    // Reseting the variables
    if (vehicle.diagSum > maxDiag) {
      vehicle.diagSum = 0;
      vehicle.diagStep = 0;
      vehicle.invertCycle = !vehicle.invertCycle;
    }
  }
}
