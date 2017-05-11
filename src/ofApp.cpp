#include "ofApp.h"

 //           _
 //  ___  ___| |_ _   _ _ __
 // / __|/ _ \ __| | | | '_ \
 // \__ \  __/ |_| |_| | |_) |
 // |___/\___|\__|\__,_| .__/
 //                    |_|

void ofApp::setup() {
  doShader = true;
  showDescription = false;
  // #ifdef TARGET_OPENGLES
	// shader.load("shaders_gles/noise.vert","shaders_gles/noise.frag");
	// #else
	// if(ofIsGLProgrammableRenderer()){
	// 	shader.load("shaders_gl3/noise.vert", "shaders_gl3/noise.frag");
	// }else{
	// 	shader.load("shaders/noise.vert", "shaders/noise.frag");
	// }
	// #endif
  shader.load("shaders/noise.vert", "shaders/noise.frag");
  shader2.load("shaders/venus.vert", "shaders/venus.frag");

  ofSetLogLevel(OF_LOG_VERBOSE);
  ofBackground(130);

  ofDisableArbTex(); // we need GL_TEXTURE_2D for our model coords.

  ofBackground(0, 0, 0);

  camera.setFarClip(20000);
  // camera.move(0,0,15000);

  scene = 4; // set scene to one

  for (unsigned int i = 0; i < modelNum; i++) {

    ofModel myModelTemp;
    myModelTemp.setup("m" + ofToString(i%modelFiles+1) + ".stl", false);
    myModelTemp.setPos(ofVec3f(ofRandom(-100, 100), ofRandom(-100, 100), ofRandom(-100, 100)));
    models.push_back(myModelTemp);

  }

}

 //                  _       _
 //  _   _ _ __   __| | __ _| |_ ___
 // | | | | '_ \ / _` |/ _` | __/ _ \
 // | |_| | |_) | (_| | (_| | ||  __/
 //  \__,_| .__/ \__,_|\__,_|\__\___|
 //       |_|

void ofApp::update() {

  // int ran = (int)ofRandom(0, modelNum);
  // models[ran].disolve(0.01);
  // models[ran].vDisplace();

  for (unsigned int i = 0; i < modelNum; i++) {
    models[i].rot.x += 0.05*i;
    models[i].rot.y += 0.08*i;
    models[i].rot.z += 0.07*i;

    models[i].pos.x = models[i].initPos.x * cos(ofGetElapsedTimeMillis()/1000.1);
    models[i].pos.y = models[i].initPos.y * sin(ofGetElapsedTimeMillis()/1000.1);
    models[i].pos.z = models[i].initPos.z * sin(ofGetElapsedTimeMillis()/1000.1)-cos(ofGetElapsedTimeMillis()/1000.1);
  }

  loop++;
}

 //      _
 //   __| |_ __ __ ___      __
 //  / _` | '__/ _` \ \ /\ / /
 // | (_| | | | (_| |\ V  V /
 //  \__,_|_|  \__,_| \_/\_/

void ofApp::draw() {

  // if( doShader ){
  //   shader.begin();
  //     //we want to pass in some varrying values to animate our type / color
  //     shader.setUniform1f("timeValX", ofGetElapsedTimef() * 0.1 );
  //     shader.setUniform1f("timeValY", -ofGetElapsedTimef() * 0.18 );
  //
  //     //we also pass in the mouse position
  //     //we have to transform the coords to what the shader is expecting which is 0,0 in the center and y axis flipped.
  //     shader.setUniform2f("mouse", mouseX - ofGetWidth()/2, ofGetHeight()/2-mouseY );
  // }

  if (scene == 1) {
    scene1();
  } else if (scene == 2) {
    scene2();
  } else if (scene == 3) {
    scene3();
  } else if (scene == 4) {
    scene4();
  }

  // else if (scene == 5) {
  //   scene5();
  // } else if (scene == 6) {
  //   scene6();
  // } else if (scene == 7) {
  //   scene7();
  // } else if (scene == 8) {
  //   scene8();
  // } else if (scene == 9) {
  //   scene9();
  // }

  // if( doShader ){
	// 	shader.end();
	// }

  // scene description
  if (showDescription) {
    ofDrawBitmapStringHighlight(titleString, 20, ofGetHeight()-270, ofColor(40), ofColor(210));
    ofDrawBitmapStringHighlight(textString, 20, ofGetHeight()-250, ofColor(210), ofColor(40));
  }

  // ofDrawBitmapStringHighlight("SCENE I " + ofToString(ofGetFrameRate(), 2), ofGetWidth()/2-40, ofGetHeight()/2-30, ofColor(200), ofColor(50));

}


 //  ____   ____ _____ _   _ _____   _
 // / ___| / ___| ____| \ | | ____| / |
 // \___ \| |   |  _| |  \| |  _|   | |
 //  ___) | |___| |___| |\  | |___  | |
 // |____/ \____|_____|_| \_|_____| |_|

void ofApp::scene1() {
  titleString = "SCENE I — The Sky";
  textString = " When we take a glimpse into the night sky, \n most of us rarely realize that \n  we are looking at history. \n Whatever we see in the night sky, is a collection of photons that \n traveled for thousands and millions of years from their point of origin. \n The photons coming from Alpha Centauri for example, which is our \n closest neighboring stellar system, \n is already 4.3 years old by the time it reaches our telescopes. \n When we look at the center of our galaxy, we see light that is 27,000 years old. \n When we observe Andromeda, our neighboring galaxy, we see light that is 2.5 million years old. \n Our night sky is filled with the cosmic past, and the gigabytes of data collected by all kinds of telescopes, \n have yet to be 'excavated' and reveal an alien civilization that may be lurking among the data. \n The sky, can be considered a opaque sediment that you can see through, and \n  observe the timeline of the universe's history. \n Just by looking at the sky, we become 'observer archeologists' \n  who are engaged in an act of excavating the past.";

  ofBackground(0, 0, 0, 255);
  ofSetColor(200, 200, 200, 255);
  camera.begin();

  ofEnableDepthTest();
  // light.enable();
  ofEnableSeparateSpecularLight();

  // models[0].draw();

  for (unsigned int i = 0; i < modelNum; i++) {

    models[i].draw();

  }

  ofDisableDepthTest();
  light.disable();
  ofDisableLighting();

  camera.end();

  ofSetColor(0, 0, 0);
}


 //  ____   ____ _____ _   _ _____   ____
 // / ___| / ___| ____| \ | | ____| |___ \
 // \___ \| |   |  _| |  \| |  _|     __) |
 //  ___) | |___| |___| |\  | |___   / __/
 // |____/ \____|_____|_| \_|_____| |_____|

void ofApp::scene2() {
  titleString = "SCENE II — The Light";
  textString = "jdl;skfjg;lsdjfgl;j";

  ofBackground(255, 255, 255, 255);
  ofSetColor(20, 20, 20, 255);
  camera.begin();

  ofEnableDepthTest();
  // light.enable();
  ofEnableSeparateSpecularLight();

  // models[0].draw();

  for (unsigned int i = 0; i < modelNum; i++) {

    models[i].draw();

  }

  ofDisableDepthTest();
  light.disable();
  ofDisableLighting();

  camera.end();

  ofSetColor(255, 255, 255);
}


 //  ____   ____ _____ _   _ _____   _____
 // / ___| / ___| ____| \ | | ____| |___ /
 // \___ \| |   |  _| |  \| |  _|     |_ \
 //  ___) | |___| |___| |\  | |___   ___) |
 // |____/ \____|_____|_| \_|_____| |____/

void ofApp::scene3() {
  titleString = "SCENE III — WTF";
  textString = "jdl;skfjg;lsdjfgl;j";

  ofBackground(cos(ofGetElapsedTimeMillis()/3400.0)*255, cos(ofGetElapsedTimeMillis()/2400.0)*255, cos(ofGetElapsedTimeMillis()/4400.0)*255, 255);
  ofSetColor(cos(ofGetElapsedTimeMillis()/3300.0*255), cos(ofGetElapsedTimeMillis()/1400.0*255), cos(ofGetElapsedTimeMillis()/3600.0)*255, 255);
  camera.begin();

  ofEnableDepthTest();
  // light.enable();
  ofEnableSeparateSpecularLight();

  // models[0].draw();

  for (unsigned int i = 0; i < modelNum; i++) {

    int randNum = (int)ofRandom(i,modelNum);

    if( i == randNum && loop % 5 == 0){
      shader.begin();
      //we want to pass in some varrying values to animate our type / color
      shader.setUniform1f("timeValX", ofGetElapsedTimef() * 0.1 );
      shader.setUniform1f("timeValY", -ofGetElapsedTimef() * 0.18 );

      //we also pass in the mouse position
      //we have to transform the coords to what the shader is expecting which is 0,0 in the center and y axis flipped.
      shader.setUniform2f("mouse", mouseX - ofGetWidth()/2, ofGetHeight()/2-mouseY );
    }

    models[i].draw();

    if( i == randNum && loop % 5 == 0){
      shader.end();
    }

  }

  ofDisableDepthTest();
  light.disable();
  ofDisableLighting();

  camera.end();

  ofSetColor(cos(ofGetElapsedTimeMillis()/1400.0)*255, cos(ofGetElapsedTimeMillis()/3600.0)*255, cos(ofGetElapsedTimeMillis()/2600.0)*255, 255);
}

 //  ____   ____ _____ _   _ _____   _  _
 // / ___| / ___| ____| \ | | ____| | || |
 // \___ \| |   |  _| |  \| |  _|   | || |_
 //  ___) | |___| |___| |\  | |___  |__   _|
 // |____/ \____|_____|_| \_|_____|    |_|
 //
void ofApp::scene4() {

  ofBackground(cos(ofGetElapsedTimeMillis()/3400.0)*255, cos(ofGetElapsedTimeMillis()/2400.0)*255, cos(ofGetElapsedTimeMillis()/4400.0)*255, 255);
  ofSetColor(cos(ofGetElapsedTimeMillis()/3300.0*255), cos(ofGetElapsedTimeMillis()/1400.0*255), cos(ofGetElapsedTimeMillis()/3600.0)*255, 255);

  camera.begin();

  if( doShader ){
    shader2.begin();
      //we want to pass in some varrying values to animate our type / color
      shader2.setUniform1f("u_time", ofGetElapsedTimef());
      shader2.setUniform2f("u_resolution", ofGetWidth(), ofGetHeight());

      // test

  }

  for (unsigned int i = 0; i < modelNum; i++) {

    models[i].draw();

  }

  if( doShader ){
    shader2.end();
  }

  camera.end();

}



 //  ____  ____   ___   ____ ____      _    __  __    ____ ___  _   _ _____ ____   ___  _     ____
 // |  _ \|  _ \ / _ \ / ___|  _ \    / \  |  \/  |  / ___/ _ \| \ | |_   _|  _ \ / _ \| |   / ___|
 // | |_) | |_) | | | | |  _| |_) |  / _ \ | |\/| | | |  | | | |  \| | | | | |_) | | | | |   \___ \
 // |  __/|  _ <| |_| | |_| |  _ <  / ___ \| |  | | | |__| |_| | |\  | | | |  _ <| |_| | |___ ___) |
 // |_|   |_| \_\\___/ \____|_| \_\/_/   \_\_|  |_|  \____\___/|_| \_| |_| |_| \_\\___/|_____|____/
 //

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
  if (key == 'f') ofToggleFullscreen();
  if (key == '1') scene = 1;
  if (key == '2') scene = 2;
  if (key == '3') scene = 3;
  if (key == '4') scene = 4;
  if (key == '5') scene = 5;
  if (key == '6') scene = 6;
  if (key == '7') scene = 7;
  if (key == '8') scene = 8;
  if (key == '9') scene = 9;
  if( key == 's') doShader = !doShader;
  if( key == 'd') showDescription = !showDescription;
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key) {
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
