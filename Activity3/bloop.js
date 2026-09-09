// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Evolution EcoSystem

// Creature class

// Create a "bloop" creature
class Bloop {
  constructor(l, dna_) {
    this.position = l.copy(); // Location
    this.velocity = createVector(0, 0);
    this.health = 200; // Life timer
    this.xoff = random(1000); // For perlin noise
    this.yoff = random(1000);
    this.dna = dna_; // DNA
    // DNA will determine size, maxspeed and visionrange
    // The bigger the bloop, the slower it is
    this.maxspeed = map(this.dna.genes[0], 0, 1, 15, 0);
    this.r = map(this.dna.genes[0], 0, 1, 0, 50);
    this.visionrange = map(this.dna.genes[1], 0, 1, this.r, this.r * 2);
    this.isseeking = false;
  }

  run() {
    this.update();
    this.borders();
    this.display();
  }

  // A bloop can find food and eat it
  eat(f) {
    let food = f.getFood();
    this.isseeking = false;
    let foodLocation, d;

    // Are we touching any food objects?
    for (let i = food.length - 1; i >= 0; i--) {
      foodLocation = food[i];
      d = p5.Vector.dist(this.position, foodLocation);

      // If we are, juice up our strength!
      if (d < this.r / 2) {
        this.health += 100;
        food.splice(i, 1);
      } else if (d <= this.visionrange / 2) {
        this.seek(foodLocation);
        this.isseeking = true;
      }
    }
  }

  // Seek moviment based on Activity 2
  seek(target) {
    let force = p5.Vector.sub(target, this.position);
    force.setMag(this.maxspeed);
    this.velocity.lerp(force, 0.1);
  }

  // If two bloops see each other, there is a teeny, tiny chance they will reproduce
  reproduce(bloops) {
    let d, other;
    let childDNA;
    let midpoint;

    // checking the distance between all bloops
    for (let i = 0; i < bloops.length; i++) {
      other = bloops[i];
      d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < this.visionrange/2 + other.r/2) {

        // sexual reproduction
        if (random(1) < 0.001) {
          // Child is crossover between both bloops
          childDNA = this.dna.crossover(other.dna);
          // Child DNA can mutate
          childDNA.mutate(0.01);
          midpoint = p5.Vector.lerp(this.position, other.position, 0.5);
          return new Bloop(midpoint, childDNA);
        } else {
          return null;
        }

      }
    }
  }

  // Method to update position
  update() {
    if (!this.isseeking) {
      // Simple movement based on perlin noise
      let vx = map(noise(this.xoff), 0, 1, -this.maxspeed, this.maxspeed);
      let vy = map(noise(this.yoff), 0, 1, -this.maxspeed, this.maxspeed);
      this.velocity = createVector(vx, vy);
    }

    this.position.add(this.velocity);
    this.xoff += 0.01;
    this.yoff += 0.01;
    this.health -= 0.2; // Death always looming
  }

  // Wraparound
  borders() {
    if (this.position.x < -this.r/2) this.position.x = width+this.r/2;
    if (this.position.y < this.r/2) this.position.y = height+this.r/2;
    if (this.position.x > width+this.r/2) this.position.x = -this.r/2;
    if (this.position.y > height+this.r/2) this.position.y = -this.r/2;
  }

  // Method to display
  display() {
    ellipseMode(CENTER);
    noStroke();
    fill(0, 255, 0, this.health);
    ellipse(this.position.x, this.position.y, this.visionrange, this.visionrange);
    stroke(0, this.health);
    fill(0, this.health);
    ellipse(this.position.x, this.position.y, this.r, this.r);
  }

  // Death
  dead() {
    if (this.health < 0.0) {
      return true;
    } else {
      return false;
    }
  }
}
