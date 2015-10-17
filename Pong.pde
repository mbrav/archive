float ballX = 100;
float ballY = 300;

float speedX = 5.0;
float speedY = 5.0;

int ballSize = 20;
int paddleSize = 100;

int[][] hitMemory = new int[10][4];

int hits;
int misses;

void setup() {
  size(600, 480);

  for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 4; j++) {
      int someColor = int(random(1, 6));
      hitMemory[i][j] = someColor;
    }
  }
}

void draw() {
  background(70, 102, 255);
  fill(255);

  boolean colision = false;
  boolean horizontalSideHit = false;

  //draw the rectangles
  for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 4; j++) {
      //check if the rectangle wasn't hit before
      if (hitMemory[i][j] != 0) {
        //check for x axis collision
        if (ballX > i * 60 - ballSize/2 && ballX < (i + 1) * 60 - ballSize/2 && ballY > j * 30 + 30 - ballSize/2 && ballY < j * 30 + 60 + ballSize/2) {
          colision = true;
        } else {
          colision = false;
        }

        // if collision was detected, won't draw the rectangle
        if (colision == true) {
          hitMemory[i][j] = 0;
          //check if the horizontal side is hit
          if (ballX < i * 60 - ballSize/2 || ballX > (i + 1) * 60 + ballSize/2) {
            horizontalSideHit = true;
            println("horizontal");
          } else if (ballY < j * 30 + 30 - ballSize/2 || ballY > j * 30 + 60 + ballSize/2) {
            horizontalSideHit = false;
            println("not horizontal");
          } else {
            println("error");
          }

          if (horizontalSideHit == true) {
            speedX = -speedX;
          } else {
            speedY = -speedY;
          }

          colision = false;

        } else {

          //color it
          if (hitMemory[i][j]== 1) {
            fill(227, 62, 62); //some red
          } else if (hitMemory[i][j] == 2) {
            fill(66, 74, 216); //some blue
          } else if (hitMemory[i][j] == 3) {
            fill(66, 187, 216); //some torquise
          } else if (hitMemory[i][j] == 4) {
            fill(193, 216, 66); //some green
          } else if (hitMemory[i][j] == 5) {
            fill(234, 215, 66); //some yellow
          } else if (hitMemory[i][j] == 6) {
            fill(93, 191, 250); //some sky blue
          } else {
            //some God color
          }

          //draw the rectangle
          stroke(255);
          strokeWeight(2);
          rect(i * 60, 30 * j + 30, 60, 30);
          noStroke();
        }
      }
    }
  }

  //draw the menu
  textSize(24);
  text("SCORE", 20, 24);
  text(hits - misses, 105, 24);

  //draw the paddle with the position of the mpouse being the middle
  rect(mouseX - paddleSize/2, height - 10, paddleSize, 10);

  ellipse(ballX, ballY, ballSize, ballSize);

  //if the ball is aproaching the paddle, decrease it's increments
  //solves #2
  if (ballY + speedY > height - ballSize/2) {
    ballY += 1;
  } else {
    ballY += speedY;
  }

  ballX += speedX;

  //bounce the ball if it hits the sides
  if (ballX > width - ballSize/2 || ballX - ballSize/2 < 0) {
    speedX = -speedX;
  }

  //bounce the ball if it hits the top
  if (ballY - ballSize/2 < 0) {
    speedY = -speedY;
  }

  //check if the mouse is under the paddle
  if (ballX > mouseX - paddleSize/2 && ballX < mouseX + paddleSize/2) {
    // count a paddle hit
    if (ballY > height - ballSize/2 - 10) {
      println("Lets Bounce!");
      hits++;
      speedY = -speedY;
    }
  } else if (ballY > height - ballSize/2) {
    println("missed");
    misses++;
    speedY = -speedY;
  }
}
