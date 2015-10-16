float ballX = 100;
float ballY = 100;

float speedX = 5.0;
float speedY = 5.0;

int ballSize = 20;
int paddleSize = 100;

void setup() {
  size(600, 480);
  background(100);
}

void draw() {
  background(0);
  fill(255);

  // draw the rectangles
  for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 4; j++) {
      rect(i * 60, 30 * j, 60, 30);
    }
  }

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
    speedY = -speedY;
  }
}
