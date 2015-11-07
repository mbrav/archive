// The Boid class

class Boid {

  PVector location;
  PVector velocity;
  PVector acceleration;
  float r;
  float maxforce;    // Maximum steering force
  float maxspeed;    // Maximum speed
  
  // ID 0 = Normal Boid
  // ID 1 = Gangser Boid
  // ID 2 = Dead Boid
  int id; // id's for diffirent types of flocks
  float health = 100;
  float confidence = 1;

  Boid(float x, float y, int _id) {
    id = _id;
    acceleration = new PVector(0, 0);

    // This is a new PVector method not yet implemented in JS
    // velocity = PVector.random2D();

    // Leaving the code temporarily this way so that this example runs in JS
    float angle = random(TWO_PI);
    velocity = new PVector(cos(angle), sin(angle));

    location = new PVector(x, y);

    // define the various Boid id's in the sketch
    if (id == 0) {
      // normal Boid
      r = 2.0;
      maxspeed = 2;
      maxforce = 0.03;
    } else if (id == 1) {
      // gangster Boid
      r = 4.0;
      maxspeed = 3;
      maxforce = 0.10;
    } else if (id == 2) {
      // dead Boid
      r = 1.0;
      maxspeed = 1;
      maxforce = 0;
    }
  }

  void run(ArrayList<Boid> boids) {
    flock(boids);
    update();
    borders();
    render();
  }

  void applyForce(PVector force) {
    // We could add mass here if we want A = F / M
    acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  void flock(ArrayList<Boid> boids) {
    PVector sep = separate(boids);   // Separation
    PVector ali = align(boids);      // Alignment
    PVector coh = cohesion(boids);   // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    applyForce(sep);
    applyForce(ali);
    applyForce(coh);
  }

  // Method to update location
  void update() {
    // Update velocity
    velocity.add(acceleration);
    // Limit speed
    velocity.limit(maxspeed);
    location.add(velocity);
    // Reset accelertion to 0 each cycle
    acceleration.mult(0);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  PVector seek(PVector target) {
    PVector desired = PVector.sub(target, location);  // A vector pointing from the location to the target
    // Scale to maximum speed
    desired.normalize();
    desired.mult(maxspeed);

    // Above two lines of code below could be condensed with new PVector setMag() method
    // Not using this method until Processing.js catches up
    // desired.setMag(maxspeed);

    // Steering = Desired minus Velocity
    PVector steer = PVector.sub(desired, velocity);
    steer.limit(maxforce);  // Limit to maximum steering force
    return steer;
  }

  void render() {
    // Draw a triangle rotated in the direction of velocity
    float theta = velocity.heading2D() + radians(90);
    // heading2D() above is now heading() but leaving old syntax until Processing.js catches up

    if (id == 0) {
      fill(200, 100);
      stroke(255);
      pushMatrix();
      translate(location.x, location.y);
      rotate(theta);
      beginShape(TRIANGLES);
      vertex(0, -r*2);
      vertex(-r, r*2);
      vertex(r, r*2);
      endShape();
      popMatrix();
    } else if (id == 1) {
      // render the gangster confident red
      if (confidence > 1) {
        fill(255, 0, 0, 200);
      } else {
        fill(200, 0, 0, 50);
      }
      ellipse(location.x, location.y, 10, 10);
    } else if (id == 2) {
      // color dead boids black
      fill(0, 200);
      stroke(50);
      ellipse(location.x, location.y, 5, 5);
      fill(200, 100);
      stroke(255);
    }
  }

  // Wraparound
  void borders() {
    if (location.x < -r) location.x = width+r;
    if (location.y < -r) location.y = height+r;
    if (location.x > width+r) location.x = -r;
    if (location.y > height+r) location.y = -r;
  }

  // Separation
  // Method checks for nearby boids and steers away
  PVector separate (ArrayList<Boid> boids) {
    float desiredseparation = 25.0f;
    PVector steer = new PVector(0, 0, 0);
    int count = 0;
    int attackableCount = 0;
    int gangMembersCount = 0;
    int hollaDistance = 50;
    // For every boid in the system, check if it's too close
    for (Boid other : boids) {
      float d = PVector.dist(location, other.location);

      // for gangsters, a farther distance is checked
      if (id == 1 && (d > 0) && (d < desiredseparation * 3)) {
        if (other.id == 1) {
          // see if any homies are nearby
          gangMembersCount++;
        }
      }

      // for normal boids, set how likely its going to get jumped
      if (id == 0 && (d > 0) && (d < desiredseparation * 3)) {
        if (other.id == 1) {
          // see if any homies are nearby
          attackableCount++;
        }
      }

      confidence = gangMembersCount;

      // "Holla at them homies"
      if (confidence > 2) {
        stroke(255, 255, 0, 60);

        // Make sure they Holla when they at da same block
        if (other.id == 1) {
          if (abs(location.x - other.location.x) < hollaDistance * confidence &&
          abs(location.y - other.location.y) < hollaDistance * confidence) {
            line(location.x, location.y, other.location.x, other.location.y);
          }
        }
        stroke(255);
      }

      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        PVector diff = PVector.sub(location, other.location);
        diff.normalize();
        diff.div(d);        // Weight by distance
        steer.add(diff);

        // if the boid is a gangster
        count++;            // Keep track of how many
      }
    }

    // formula for figuring out when to kill someone
    if (attackableCount > confidence) {
      int ran = (int(random(20)));
      // kill it
      id = 2;

      // or it has a 5% chance to become part of the gang
      if (ran == 5) {
        id = 1;
      }
    }

    // Average -- divide by how many
    if (count > 0) {
      steer.div((float)count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // First two lines of code below could be condensed with new PVector setMag() method
      // Not using this method until Processing.js catches up
      // steer.setMag(maxspeed);

      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(maxspeed);
      steer.sub(velocity);
      steer.limit(maxforce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  PVector align (ArrayList<Boid> boids) {
    float neighbordist = 50;
    PVector sum = new PVector(0, 0);
    int count = 0;
    for (Boid other : boids) {
      float d = PVector.dist(location, other.location);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div((float)count);
      // First two lines of code below could be condensed with new PVector setMag() method
      // Not using this method until Processing.js catches up
      // sum.setMag(maxspeed);

      // Implement Reynolds: Steering = Desired - Velocity
      sum.normalize();
      sum.mult(maxspeed);
      PVector steer = PVector.sub(sum, velocity);
      steer.limit(maxforce);
      return steer;
    }
    else {
      return new PVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  PVector cohesion (ArrayList<Boid> boids) {
    float neighbordist = 50;
    PVector sum = new PVector(0, 0);   // Start with empty vector to accumulate all locations
    int count = 0;
    for (Boid other : boids) {
      float d = PVector.dist(location, other.location);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.location); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return seek(sum);  // Steer towards the location
    }
    else {
      return new PVector(0, 0);
    }
  }
}
