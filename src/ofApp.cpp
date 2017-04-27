#include "ofApp.h"

//--------------------------------------------------------------

 //           _
 //  ___  ___| |_ _   _ _ __
 // / __|/ _ \ __| | | | '_ \
 // \__ \  __/ |_| |_| | |_) |
 // |___/\___|\__|\__,_| .__/
 //                    |_|

void ofApp::setup() {
  ofSetLogLevel(OF_LOG_VERBOSE);
  ofBackground(130);

  ofDisableArbTex(); // we need GL_TEXTURE_2D for our model coords.

  areaLight.setup();
  areaLight.enable();
  // areaLight.setAreaLight(120, 120);
  // areaLight.setSpotlight(80,3);
  areaLight.setAmbientColor(ofFloatColor(0.8, 0.8, 0.8));
  areaLight.setAttenuation(1.0, 0.01, 0.01);
  areaLight.setDiffuseColor(ofFloatColor(0.9, 0.9, 1));
  areaLight.setSpecularColor(ofFloatColor(1, 0.8, 1));
  // areaLight.rotate(-90,ofVec3f(1,0,0));
  // areaLight.rotate(30,ofVec3f(0,0,1));
  // areaLight.setPosition(1000,1000,1000);

  ofBackground(0, 0, 0);


  lightRot = ofVec2f(0);

  camera.setFarClip(20000);
  // camera.move(0,0,15000);

  for (unsigned int i = 0; i < modelNum; i++) {

    ofxAssimpModelLoader modelTemp;
    ofMesh meshTemp;
    ofVbo vboTemp;


 //                      _      _   _                 _
 //  _ __ ___   ___   __| | ___| | | | ___   __ _  __| |
 // | '_ ` _ \ / _ \ / _` |/ _ \ | | |/ _ \ / _` |/ _` |
 // | | | | | | (_) | (_| |  __/ | | | (_) | (_| | (_| |
 // |_| |_| |_|\___/ \__,_|\___|_| |_|\___/ \__,_|\__,_|


    modelTemp.loadModel("m" + ofToString(i%modelFiles+1) + ".stl", false);
    modelTemp.setPosition(ofRandom(-1000, 1000), ofRandom(-1000, 1000), ofRandom(-1000, 1000));


 //  _ __ ___   ___  ___| |__
 // | '_ ` _ \ / _ \/ __| '_ \
 // | | | | | |  __/\__ \ | | |
 // |_| |_| |_|\___||___/_| |_|

    meshTemp = modelTemp.getMesh(0);
    // meshTemp.setPosition(ofRandom(-1000, 1000), ofRandom(-1000, 1000), ofRandom(-1000, 1000));
    // OF_PRIMITIVE_TRIANGLES means every three vertices create a triangle
  	meshTemp.setMode(OF_PRIMITIVE_TRIANGLES);


    // ofColor color;
    ofColor color((int)ofRandom(256.0f), (int)ofRandom(256.0f), (int)ofRandom(256.0f));
    for (int i = 0; i < meshTemp.getNumIndices() - 2; i += 3) {


      if (i % 300 == 0) {

        color = ofColor((int)ofRandom(256.0f), (int)ofRandom(256.0f), (int)ofRandom(256.0f));

      }
      meshTemp.addColor(color);
      meshTemp.addColor(color);
      meshTemp.addColor(color);
    }

    ofPushMatrix();

    ofTranslate(ofRandom(-1000, 1000) , ofRandom(-1000, 1000), ofRandom(-1000, 1000));

    // randomize
    // if (i % 2 == 0) {
    //   model[i].draw(OF_MESH_FILL);
    // } else {
    //   model[i].draw(OF_MESH_POINTS);
    // }
    ofPopMatrix();


   //        _
   // __   _| |__   ___
   // \ \ / / '_ \ / _ \
   //  \ V /| |_) | (_) |
   //   \_/ |_.__/ \___/

    // The possible options for usage are: GL_STREAM_DRAW, GL_STREAM_READ, GL_STREAM_COPY, GL_STATIC_DRAW, GL_STATIC_READ, GL_STATIC_COPY, GL_DYNAMIC_DRAW, GL_DYNAMIC_READ, or GL_DYNAMIC_COP
    vboTemp.setMesh(meshTemp, GL_STATIC_DRAW);

    model.push_back(modelTemp);
    mesh.push_back(meshTemp);
    vbo.push_back(vboTemp);

  }

}

//--------------------------------------------------------------


 //                  _       _
 //  _   _ _ __   __| | __ _| |_ ___
 // | | | | '_ \ / _` |/ _` | __/ _ \
 // | |_| | |_) | (_| | (_| | ||  __/
 //  \__,_| .__/ \__,_|\__,_|\__\___|
 //       |_|
 //
void ofApp::update() {
  // model.update();

  // for (unsigned int i = 0; i < modelNum; i++) {
  //   model[i].update();
  // }

  // mesh = model.getCurrentAnimatedMesh(0);

  areaLight.setPosition(0,0,100);

	areaLight.rotate(cos(lightRot.x)/2.,ofVec3f(1,0,0));
	areaLight.rotate(sin(lightRot.y)/2.,ofVec3f(0,0,1));

	lightRot.x += 0.05;
	lightRot.y += 0.05;
}

//--------------------------------------------------------------


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

    // vbo[i].draw(GL_QUADS,0,24);



    // randomize
    // if (i % 2 == 0) {
    //   mesh[i].draw(OF_MESH_FILL);
    // } else {
    //   mesh[i].draw(OF_MESH_POINTS);
    // }
    mesh[i].draw(OF_MESH_FILL); // draw an ofMesh (slower) when no key is pressed
  }

  // for (unsigned int i = 0; i < modelNum; i++) {
  //
  //   // model[i].drawFaces();
  //
  //   // ofEnableBlendMode(OF_BLENDMODE_ALPHA);
  //   //
  // // #ifndef TARGET_PROGRAMMABLE_GL
  // //   glShadeModel(GL_SMOOTH); // some model / light stuff
  //   light.enable();
  //   ofEnableSeparateSpecularLight();
  // // #endif
  //
  //   ofPushMatrix();
  //
  //   ofTranslate(model[i].getPosition().x + 100, model[i].getPosition().y, 0);
  //   ofRotate(ofGetElapsedTimef()*8.0*i, ofGetElapsedTimef()*5.6*i, 0, 0);
  //   ofTranslate(-model[i].getPosition().x, - model[i].getPosition().y, 0);
  //
  //   // randomize
  //   // if (i % 2 == 0) {
  //   //   model[i].draw(OF_MESH_FILL);
  //   // } else {
  //   //   model[i].draw(OF_MESH_POINTS);
  //   // }
  //   ofPopMatrix();
  //
  // }

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
