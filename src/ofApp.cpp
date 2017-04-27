#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup() {
  ofSetLogLevel(OF_LOG_VERBOSE);
  ofBackground(130);

  ofDisableArbTex(); // we need GL_TEXTURE_2D for our models coords.

  areaLight.setup();
  areaLight.enable();
  areaLight.setAreaLight(120, 120);
  // areaLight.setSpotlight(80,3);
  areaLight.setAmbientColor(ofFloatColor(0.8, 0.8, 0.8));
  areaLight.setAttenuation(1.0, 0.01, 0.01);
  areaLight.setDiffuseColor(ofFloatColor(0.9, 0.9, 1));
  areaLight.setSpecularColor(ofFloatColor(1, 0.8, 1));
  // areaLight.rotate(-90,ofVec3f(1,0,0));
  // areaLight.rotate(30,ofVec3f(0,0,1));
  // areaLight.setPosition(1000,1000,1000);

  ofBackground(0, 0, 0);

  materialPlane.setAmbientColor(ofFloatColor(0, 0, 0, 1.0));
  materialPlane.setDiffuseColor(ofFloatColor(1, 1, 1, 1.0));
  materialPlane.setSpecularColor(ofFloatColor(1, 1, 1, 1.0));
  materialPlane.setShininess(100);

  lightRot = ofVec2f(0);

  camera.setFarClip(20000);
  // camera.move(0,0,15000);

  for (unsigned int i = 0; i < modelNum; i++) {

    ofxAssimpModelLoader modelTemp;

    modelTemp.loadModel("m" + ofToString(i%modelFiles+1) + ".stl", false);
    modelTemp.setPosition(ofRandom(0, 2000), ofRandom(0, 2000), ofRandom(0, 2000));

    models.push_back(modelTemp);

  }

}

//--------------------------------------------------------------
void ofApp::update() {
  // model.update();

  // for (unsigned int i = 0; i < modelNum; i++) {
  //   models[i].update();
  // }

  // mesh = model.getCurrentAnimatedMesh(0);

  areaLight.setPosition(0,0,100);

	areaLight.rotate(cos(lightRot.x)/2.,ofVec3f(1,0,0));
	areaLight.rotate(sin(lightRot.y)/2.,ofVec3f(0,0,1));

	lightRot.x += 0.05;
	lightRot.y += 0.05;
}

//--------------------------------------------------------------
void ofApp::draw() {
  camera.begin();
	materialPlane.begin();


  for (unsigned int i = 0; i < modelNum; i++) {

    ofSetColor(0);

    ofEnableBlendMode(OF_BLENDMODE_ALPHA);

    ofEnableDepthTest();
  #ifndef TARGET_PROGRAMMABLE_GL
    glShadeModel(GL_SMOOTH); // some model / light stuff
  #endif
    light.enable();
    ofEnableSeparateSpecularLight();

    ofPushMatrix();
    ofTranslate(models[i].getPosition().x + 100, models[i].getPosition().y, 0);
    ofRotate(ofGetElapsedTimef()*8.0, ofGetElapsedTimef()*5.6, 0, 0);
    ofTranslate(-models[i].getPosition().x, - models[i].getPosition().y, 0);
    models[i].drawFaces();
    ofPopMatrix();
  #ifndef TARGET_PROGRAMMABLE_GL
    glEnable(GL_NORMALIZE);
  #endif
    ofPushMatrix();
    ofTranslate(models[i].getPosition().x - 300, models[i].getPosition().y, 0);
    ofRotate(-mouseX, 0, 1, 0);
    ofTranslate(-models[i].getPosition().x, -models[i].getPosition().y, 0);

    ofxAssimpMeshHelper &meshHelper = models[i].getMeshHelper(0);

    ofMultMatrix(models[i].getModelMatrix());
    ofMultMatrix(meshHelper.matrix);

    ofMaterial &material = meshHelper.material;

    material.begin();
    // meshes[i].drawWireframe();
    material.end();

    ofPopMatrix();
  }

  // int size = 50;
  // int circleSize = 10;
  // float circleSpacing = 2.1;
  // int width = circleSize*circleSpacing*size/2;

  // generate new values for connections
  // int x, y, z;
  // for (unsigned int i = 0; i < size; i++) {
  //   for (unsigned int j = 0; j < size; j++) {
  //     x = (circleSize*circleSpacing) * i - width;
  //     y = (circleSize*circleSpacing) * j - width;
  //     z = (cos(ofGetElapsedTimeMillis()/213.+i)*1.3 + cos(ofGetElapsedTimeMillis()/123.+j)) * 8.0;
  //
  //
  //     ofDrawSphere(x,y,z, circleSize);
  //
  //   }
  // }

  ofDisableDepthTest();
  light.disable();
  ofDisableLighting();
  ofDisableSeparateSpecularLight();

  materialPlane.end();
  areaLight.draw();
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
