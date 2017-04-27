#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup() {
  ofSetLogLevel(OF_LOG_VERBOSE);
  ofBackground(50, 0);

  ofDisableArbTex(); // we need GL_TEXTURE_2D for our models coords.

  model.loadModel("Terracotta_neck-amphora_storage_jar.stl", false);
  model.setPosition(500, 500, ofRandom(0, 200));

  // model2.loadModel("Marble_Strigilated_vase_with_snake_handles.stl");
  // model2.setPosition(ofRandom(0, 200), ofRandom(0, 200),ofRandom(0, 200));
  //
  // model3.loadModel("marble_statue_of_a_lion.stl");
  // model3.setPosition(ofRandom(0, 200), ofRandom(0, 200),ofRandom(0, 200));
  //
  // model4.loadModel("test.stl");
  // model4.setPosition(ofRandom(0, 200), ofRandom(0, 200),ofRandom(0, 200));
  //
  // model5.loadModel("Figure_of_a_horse.stl");
  // model5.setPosition(ofRandom(0, 200), ofRandom(0, 200),ofRandom(0, 200));

  areaLight.setup();
  areaLight.enable();
  areaLight.setAreaLight(120, 120);
  // areaLight.setSpotlight(80,3);
  areaLight.setAmbientColor(ofFloatColor(0.1, 0.1, 0.1));
  areaLight.setAttenuation(1.0, 0.0001, 0.0001);
  areaLight.setDiffuseColor(ofFloatColor(0.4, 0.9, 1));
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
    // points.push_back(ofPoint(ofRandomf() * 100, ofRandomf() * 100, ofRandomf() * 100));

    ofxAssimpModelLoader modelTemp;

    modelTemp.loadModel("Terracotta_neck-amphora_storage_jar.stl", false);
    modelTemp.setPosition(ofRandom(0, 2000), ofRandom(0, 2000), ofRandom(0, 2000));

    models.push_back(modelTemp);

    // cout << models.length() << endl;
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

	int size = 50;
	int circleSize = 10;
	float circleSpacing = 2.1;
	int width = circleSize*circleSpacing*size/2;

	// generate new values for connections

	// for(unsigned int i=0; i < points.size(); i++) {
	// 	// ofDrawLine(points[i-1], points[i]);
	// 	randomInts[i] = ofRandom(0, size * size);
	// }

  for (unsigned int i = 0; i < modelNum; i++) {

    ofSetColor(255);

    ofEnableBlendMode(OF_BLENDMODE_ALPHA);

    ofEnableDepthTest();
  #ifndef TARGET_PROGRAMMABLE_GL
    glShadeModel(GL_SMOOTH); // some model / light stuff
  #endif
    light.enable();
    ofEnableSeparateSpecularLight();

    ofPushMatrix();
    // ofTranslate(model.getPosition().x + 100, model.getPosition().y, 0);
    // ofRotate(-mouseX, 0, 1, 0);
    ofTranslate(-models[i].getPosition().x, - models[i].getPosition().y, 0);
    models[i].drawFaces();
    ofPopMatrix();
  #ifndef TARGET_PROGRAMMABLE_GL
    glEnable(GL_NORMALIZE);
  #endif
    ofPushMatrix();
    // ofTranslate(model.getPosition().x - 300, model.getPosition().y, 0);
    // ofRotate(-mouseX, 0, 1, 0);
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

  // generate new values for connections
  int x, y, z;
  for (unsigned int i = 0; i < size; i++) {
    for (unsigned int j = 0; j < size; j++) {
      x = (circleSize*circleSpacing) * i - width;
      y = (circleSize*circleSpacing) * j - width;
      z = (cos(ofGetElapsedTimeMillis()/213.+i)*1.3 + cos(ofGetElapsedTimeMillis()/123.+j)) * 8.0;

      // lines
      // for (unsigned int k = 1; k < points.size(); k++) {
      // 	if (randomInts[k] == i*j) {
      // 		points[k]=ofPoint(x, y, z);
      //
      // 		ofDrawLine(points[k-1], points[k]);
      //
      // 	}
      // }

      // spheres

      ofDrawSphere(x,y,z, circleSize);

    }
  }

  ofDisableDepthTest();
  light.disable();
  ofDisableLighting();
  ofDisableSeparateSpecularLight();

  materialPlane.end();
  areaLight.draw();
  camera.end();

  ofSetColor(255, 255, 255);
  ofDrawBitmapString("fps: " + ofToString(ofGetFrameRate(), 2), 10, 15);
  ofDrawBitmapString("keys 1-5 load models, spacebar to trigger animation", 10,
                     30);
  ofDrawBitmapString("drag to control animation with mouseY", 10, 45);
  ofDrawBitmapString("num animations for this model: " +
                         ofToString(model.getAnimationCount()),
                     10, 60);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
  if (key == 'f')
    ofToggleFullscreen();
  ofPoint modelPosition(ofGetWidth() * 0.5, (float)ofGetHeight() * 0.75);
  switch (key) {
  case '1':
    model.loadModel("Terracotta_neck-amphora_storage_jar.stl");
    model.setPosition(modelPosition.x, modelPosition.y, modelPosition.z);
    ofEnableSeparateSpecularLight();
    break;
  case '2':
    model.loadModel("Terracotta_neck-amphora_storage_jar.stl");
    model.setPosition(modelPosition.x, modelPosition.y, modelPosition.z);
    model.setRotation(0, -180, 1, 0, 0);
    ofEnableSeparateSpecularLight();
    break;
  case '3':
    model.loadModel("Marble_Strigilated_vase_with_snake_handles.stl");
    model.setPosition(modelPosition.x, modelPosition.y, modelPosition.z);
    ofDisableSeparateSpecularLight();
    break;
  case '4':
    model.loadModel("marble_statue_of_a_lion.stl");
    model.setPosition(modelPosition.x, modelPosition.y, modelPosition.z);
    model.setRotation(90, 0, 90, 0, 1);
    ofDisableSeparateSpecularLight();
    break;
  case '5':
    model.loadModel("Figure_of_a_horse.stl");
    model.setPosition(modelPosition.x, modelPosition.y, modelPosition.z);
    ofDisableSeparateSpecularLight();
    break;
  case '6':
    model.loadModel("test.stl");
    model.setPosition(modelPosition.x, modelPosition.y, modelPosition.z);
    model.setRotation(0, -90, 90, 0, 1);
    ofDisableSeparateSpecularLight();
    break;
  case ' ':
    // bAnimate = !bAnimate;
    break;
  default:
    break;
  }

  // mesh = model.getMesh(0);

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
