float ballX = 100;
float ballY = 300;

float speedX = 5.0;
float speedY = 6.0;

int ballSize = 20;
int paddleSize = 100;

int[][] hitMemory = new int[10][4];

int hits;
boolean gameover;
int life = 3;

void setup() {
  size(600, 480);
  pixelDensity(2); // Uncomment if using a non-retina screen
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
  boolean verticalSideHit = false;

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

        // if collision was detected, don't draw the rectangle
        if (colision == true) {
          hits++;

          //set the rectangle to 0
          hitMemory[i][j] = 0;

          //check if the horizontal side is hit
          if (ballX < i * 60 || ballX > (i + 1) * 60) {
            horizontalSideHit = true;
            println("Horizontal");
          }

          //check if the vertical side is hit
          if (ballY < j * 30 + 30 || ballY > j * 30 + 60) {
            verticalSideHit = true;
            println("Vertical");
          }

          if (horizontalSideHit == true) {
            speedX = -speedX;
            horizontalSideHit = false;
          }

          if (verticalSideHit == true) {
            speedY = -speedY;
            verticalSideHit = false;
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

  //gameover screen
  if (life == 0) {
    gameover = true;
    speedX = 0;
    speedY = 0;
    textSize(60);
    text("GAME OVER", 120, 400);
    mousePressed();
  }

  //draw the life bar
  fill(255, 0, 0);
  for (int i = 0; i < life; i++) {
    ellipse(500 + (i * 30), 15, 20, 20);
  }

  //draw the menu and score
  fill(255);
  textSize(24);
  text("SCORE", 20, 24);
  text(hits, 105, 24);

  //draw the paddle with the position of the mpouse being the middle
  rect(mouseX - paddleSize/2, height - 10, paddleSize, 10);

  ellipse(ballX, ballY, ballSize, ballSize);

  //if the ball is aproaching the paddle, decrease it's increments
  //solves #2
  if (ballY + speedY > height - ballSize/2 && life !=0) {
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
      speedY = -speedY;
    }
  } else if (ballY > height - ballSize/2) {
    println("missed");
    life--;
    speedY = -speedY;
  }
}

void mouseClicked() {
  if (gameover == true) {
    gameover = false;
    life = 3;
    hits = 0;
    ballX = 100;
    ballY = 300;
    speedX = 5.0;
    speedY = 6.0;
  }
}
