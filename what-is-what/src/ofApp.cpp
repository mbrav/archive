#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    mySound.load("Star69.mp3");
    mySound.play();

    ofBackground(0, 0, 0);

    count = 0;
    modeClock = 0;
    trackDropTime = 58000;

    squareNumX = 26;
    squareNumY = 16;

    w  = ofGetWidth();
    h  = ofGetHeight();

    squareSize = 20;
    squareMaxSize = 40;
    helpDialog = true;
    add = 1;
}

//--------------------------------------------------------------
void ofApp::update(){
    count ++;
    rotateAdd += add;

    if (ofGetElapsedTimeMillis()/ 1000 != modeClock) {
      modeClock ++;
      generateNewColor = true;
    }

    if (autopilotMode) {
      if (count % 100 == 0) {
        // make sure it doesn't go beyond 5
        add = (add % 5) + 1;
      }

      if (count % 10 == 0) {
        // make sure it doesn't go beyond maximum square size
        squareSize = (squareSize % squareMaxSize) + 1;
      }
    }

}

//--------------------------------------------------------------
void ofApp::draw(){

    // Toggle Background color
    if (mode1) {
        ofBackground(100, 100, 100);
    } else {
        ofBackground(0, 0, 0);
    }

    // generate new color
    if (generateNewColor) {
      generateNewColor = false;
      ofSetColor((int)ofRandom(0,255),(int)ofRandom(0,255),(int)ofRandom(0,255));
    }

    // INTRO
    if (ofGetElapsedTimeMillis() < 15000) {
      // Horizontal Squares Intro

        ofPushMatrix();
        ofTranslate(w/2,h/2,0);
        ofRotate(rotateAdd, 0, 0, 1);
        ofDrawBitmapStringHighlight("'They Dont Know What Is What'", -100, -25);
        ofDrawBitmapStringHighlight("by Michael Braverman ", -100, 0);
        ofDrawBitmapStringHighlight("Music: Four Tet - Star 69 ", -100, 25);
      for (int i = 0; i < (count % 20); i ++) {
          ofDrawRectangle(w/2+ 10*i, h/2 - 25, 5, 5);
          ofDrawRectangle(w/2 + 10*i, h/2, 5, 5);
          ofDrawRectangle(w/2 + 10*i, h/2 + 25, 5, 5);
          ofDrawRectangle(w/2 + 10*i, h/2 + 50, 5,5);
      }
      ofPopMatrix();
    }


    // BEFORE DROP
    else if (ofGetElapsedTimeMillis() > 15000 && ofGetElapsedTimeMillis() < trackDropTime) {
      ofPushMatrix();
      ofTranslate(200,200,0);
      ofRotate(rotateAdd, 0, 0, 1);

      // "Cornering Squares"
      // from top left angle
      if (modeClock % 2 == 0) {
        for (int i = 0; i < ofGetElapsedTimeMillis()/100 % squareNumX; i ++) {
          for (int j = 0; j < (count % squareNumY); j ++) {

            // draw
            ofRotate(50, 1, 0.5, 0);
            ofDrawRectangle(10 + 30*i, 10 + 30*j, squareSize, squareSize);
            ofDrawRectangle(10 + 30*j, 10 + 30*i, squareSize, squareSize);

          }
        }
      }

      // from bottom right angle
      else if (modeClock % 4 == 1) {
        for (int i = ofGetElapsedTimeMillis()/200 % squareNumX; i > 0; i --) {
          for (int j = (count % squareNumY); j > 0; j --) {

            // draw
            ofDrawRectangle(800 - (10 + 30*i), 480 - (10 + 30*j), squareSize, squareSize);
            ofDrawRectangle(800 - (10 + 30*j), 480 - (10 + 30*i), squareSize, squareSize);

          }
        }
      }

      // from top right angle
      else if (modeClock % 4 == 2) {
        for (int i = ofGetElapsedTimeMillis()/200 % squareNumX; i > 0; i --) {
          for (int j = (count % squareNumY); j > 0; j --) {

            // draw
            ofDrawRectangle(800 - (10 + 30*i), 10 + 30*j, squareSize, squareSize);
            ofDrawRectangle(10 + 30*j, 480 - (10 + 30*i), squareSize, squareSize);

          }
        }
      }

      // from bottom left angle
      else if (modeClock % 4 == 3) {
        for (int i = ofGetElapsedTimeMillis()/200 % squareNumX; i > 0; i --) {
          for (int j = (count % squareNumY); j > 0; j --) {

            // draw
            ofDrawRectangle(10 + 30*i, 480 - (10 + 30*j), squareSize, squareSize);
            ofDrawRectangle(800 - (10 + 30*j), 10 + 30*i, squareSize, squareSize);

          }
        }
      }
      ofPopMatrix();
    }

    // AFTER DROP
    else if (ofGetElapsedTimeMillis() > trackDropTime) {

      // Simple Pattern
      if (modeClock % 4 == 0) {
        for (int i = 0; i < ofGetElapsedTimeMillis()/100 % squareNumX; i ++) {
          for (int j = 0; j < (count % squareNumY); j ++) {
            ofPushMatrix();
            ofTranslate(w/2,h/2,0);
            ofRotate(rotateAdd, 0, 0, 1);

            // draw
            ofDrawRectangle(10 + 30*i, 10 + 30*j, squareSize, squareSize);
            ofDrawRectangle(10 + 30*j, 10 + 30*i, squareSize, squareSize);

            ofPopMatrix();

          }
        }
      }

      // PATTERN 1
      else if (modeClock % 4 == 1) {
        for (int i = 0; i < squareNumX; i ++) {
          for (int j = 0; j < squareNumY; j ++) {

            // randomize color
            ofSetColor((int)ofRandom(0,255),(int)ofRandom(0,255),(int)ofRandom(0,255));

            if (i % 2 ==0 ) {
              ofPushMatrix();
              ofTranslate(10 + 30*i,10 + 30*j,0);
              ofRotate(rotateAdd, 0, 0, 1);
              ofDrawRectangle(10 + 30*i, 10 + 30*j, squareSize, squareSize);
              ofPopMatrix();
            } else {
              // draw
              ofDrawRectangle(10 + 30*i, 10 + 30*j, squareSize, squareSize);
            }
          }
        }
      }

      // PATTERN 2
      else if (modeClock % 4 == 2) {
        for (int i = 0; i < squareNumX; i ++) {
          for (int j = 0; j < squareNumY; j ++) {

            // randomize color
            ofSetColor((int)ofRandom(0,255),(int)ofRandom(0,255),(int)ofRandom(0,255));

            if (j % 2 == 1 ) {
              ofPushMatrix();
              ofTranslate(10 + 30*i,10 + 30*j,0);
              ofRotate(rotateAdd, 0, 0, 1);
              ofDrawRectangle(10 + 30*i, 10 + 30*j, squareSize, squareSize);
              ofPopMatrix();
            } else {
              // draw
              ofDrawRectangle(10 + 30*i, 10 + 30*j, squareSize, squareSize);
            }
          }
        }
      }
      // PATTERN 2
      else if (modeClock % 4 == 2) {
        for (int i = 0; i < squareNumX; i ++) {
          for (int j = 0; j < squareNumY; j ++) {

            // randomize color
            ofSetColor((int)ofRandom(0,255),(int)ofRandom(0,255),(int)ofRandom(0,255));

            if (j % 2 == 1 ) {
              ofPushMatrix();
              ofTranslate(10 + 30*i,10 + 30*j,0);
              ofRotate(rotateAdd, 0, 0, 1);
              ofDrawRectangle(10 + 30*i, 10 + 30*j, squareSize, squareSize);
              ofPopMatrix();
            } else {
              // draw
              ofDrawRectangle(10 + 30*i, 10 + 30*j, squareSize, squareSize);
            }
          }
        }
      }

      // PATTERN 3 , draw all rectnagles
      else if (modeClock % 4 == 3) {
        for (int i = 0; i < squareNumX; i ++) {
          for (int j = 0; j < squareNumY; j ++) {

            // randomize color
            ofSetColor((int)ofRandom(0,255),(int)ofRandom(0,255),(int)ofRandom(0,255));

              ofDrawRectangle(10 + 30*i, 10 + 30*j, squareSize, squareSize);
            }
          }
        }
      }


  if (helpDialog) {
    ofDrawBitmapStringHighlight("Press '1' to toggle background", 10, ofGetHeight() - 110);
    ofDrawBitmapStringHighlight("Press '2' and '3' to control square size", 10, ofGetHeight() - 90);
    ofDrawBitmapStringHighlight("Press '4', '5', '6' to set rotation speed to 1, 3, and 5", 10, ofGetHeight() - 70);
    ofDrawBitmapStringHighlight("Press 'a' for Autopilot VJ mode", 10, ofGetHeight() - 50);
    ofDrawBitmapStringHighlight("'h' - help dialog", 10, ofGetHeight() - 30);
    ofDrawBitmapStringHighlight("'i' - info dialog", 10, ofGetHeight() - 10);
  }

  if (infoPanel) {
    ofDrawBitmapStringHighlight("FPS ", 10, 20);
    ofDrawBitmapStringHighlight("Square Size ", 10, 40);
    ofDrawBitmapStringHighlight("Mode Clock ", 10, 60);
    ofDrawBitmapStringHighlight(ofToString(ofGetFrameRate()), 150, 20);
    ofDrawBitmapStringHighlight(ofToString(squareSize), 150, 40);
    ofDrawBitmapStringHighlight(ofToString(modeClock), 150, 60);
  }

  if (autopilotMode) {
    ofDrawBitmapStringHighlight("Autopilot Mode ON", ofGetWidth() - 140, 20);
  }
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

  // toggle background
  if (key == '1') {
      mode1 = !mode1;
  }

  // decrease size
  if (key == '2') {
      squareSize -= 2;
  }

  // increase size
  if (key == '3') {
      squareSize += 2;
  }

  // set to default rotation speed
  if (key == '3') {
      add = 1;
  }

  // set to fast
  if (key == '4') {
      add = 3;
  }

  // set to fastest
  if (key == '5') {
      add = 5;
  }

  // help dialog
  if (key == 'h' || key == 'H') {
      helpDialog = !helpDialog;
  }

  // info panel
  if (key == 'i' || key == 'I') {
      infoPanel = !infoPanel;
  }

  // autopilot mode
  if (key == 'a' || key == 'A') {
      autopilotMode = !autopilotMode;
  }
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){

}
