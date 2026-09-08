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
let counter;

function setup() {
  createCanvas(windowWidth, windowHeight);
  vehicle = new Vehicle(width/2, height/2);
  target = createVector(random(width), random(height));
  counter = 0;
}

function draw() {
  background(0);
  fill(255, 0, 0);
  textSize(24);
  noStroke();
  
  d = ((target.x - vehicle.pos.x)**2 + (target.y - vehicle.pos.y)**2)**(1/2)
  if (d < 16) {
    target = createVector(random(width), random(height));
    counter += 1;
  }
  
  circle(target.x, target.y, 32);
  text("Comida: " + counter, 50, 50);
  
  vehicle.seek(target);
  vehicle.update();
  vehicle.show();
}
