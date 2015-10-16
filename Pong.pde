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
  rect(mouseX-paddleSize/2, height-10, paddleSize, 10);

  ellipse(ballX, ballY, ballSize, ballSize);

  if (ballY + speedY > height - ballSize/2) {
    ballY += 1;
  } else {
    ballY += speedY;
  }

  ballX += speedX;

  if (ballX > width - ballSize/2 || ballX - ballSize/2 < 0) {
    speedX = -speedX;
  }

  if (ballY - ballSize/2 < 0) {
    speedY = -speedY;
  }

  // check if the mouse is under the paddle
  if (ballX > mouseX - paddleSize/2 && ballX < mouseX + paddleSize/2) {
    if (ballY > height - ballSize/2 - 10) {
      println("Lets Bounce!");
      speedY = -speedY;
    }
  } else if (ballY > height - ballSize/2) {
    println("missed");
    speedY = -speedY;
  }
}
