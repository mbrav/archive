#include "ofApp.h"

 //           _
 //  ___  ___| |_ _   _ _ __
 // / __|/ _ \ __| | | | '_ \
 // \__ \  __/ |_| |_| | |_) |
 // |___/\___|\__|\__,_| .__/
 //                    |_|

void ofApp::setup() {

  ofSetLogLevel(OF_LOG_VERBOSE);
  ofBackground(130);

  // ofDisableArbTex(); // we need GL_TEXTURE_2D for our model coords.

  ofBackground(0, 0, 0);

  camera.setFarClip(20000);
  // camera.move(0,0,15000);

  for (unsigned int i = 0; i < modelNum; i++) {

    ofModel myModelTemp;
    myModelTemp.setup("m" + ofToString(i%modelFiles+1) + ".stl");
    models.push_back(myModelTemp);

  }

}

 //                  _       _
 //  _   _ _ __   __| | __ _| |_ ___
 // | | | | '_ \ / _` |/ _` | __/ _ \
 // | |_| | |_) | (_| | (_| | ||  __/
 //  \__,_| .__/ \__,_|\__,_|\__\___|
 //       |_|
 //
void ofApp::update() {

}

 //      _
 //   __| |_ __ __ ___      __
 //  / _` | '__/ _` \ \ /\ / /
 // | (_| | | | (_| |\ V  V /
 //  \__,_|_|  \__,_| \_/\_/

void ofApp::draw() {

  ofBackground(255, 255, 255, 255);
  ofSetColor(20, 20, 20, 255);
  camera.begin();

  ofEnableDepthTest();
  // light.enable();
  ofEnableSeparateSpecularLight();

  for (unsigned int i = 0; i < modelNum; i++) {

    models[i].draw();

  }

  ofDisableDepthTest();
  // light.disable();
  // ofDisableLighting();
  // ofDisableSeparateSpecularLight();

  camera.end();

  ofSetColor(255, 255, 255);
  ofDrawBitmapString("fps: " + ofToString(ofGetFrameRate(), 2), 10, 15);

}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
  if (key == 'f')
    ofToggleFullscreen();
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key) {
  //
}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y) {}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y) {}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y) {}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h) {}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg) {}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo) {}
