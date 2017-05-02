#include "ofModel.h"

ofModel::ofModel() {

}

ofModel::~ofModel() {

}

void ofModel::setup(string filePath) {
    model.loadModel(filePath, false);
    ofVec3f randomPos(ofRandom(-100, 100), ofRandom(-100, 100), ofRandom(-100, 100));
    model.setPosition(randomPos.x, randomPos.y, randomPos.z);
    mesh = model.getMesh(0);
    mesh.setMode(OF_PRIMITIVE_TRIANGLES);

    ofColor color((int)ofRandom(25.0f), (int)ofRandom(25.0f), (int)ofRandom(25.0f));

    initPos.set(0, 0, 0); // average position (center) of a model
    for (int i = 0; i < mesh.getNumIndices() - 2; i += 1) {


      ofVec3f vert = mesh.getVertex(i);
      vert.x += randomPos.x;
      vert.y += randomPos.y;
      vert.z += randomPos.z;

      mesh.setVertex(i, vert);

      int contrast = 100;
      if (i % (mesh.getNumIndices()/50) == 0) {
        // Random contrasting colors
        float rand = ofRandom(1);
        if (rand > 0.5){
          color = ofColor(255 - (int)ofRandom(contrast), 255 - (int)ofRandom(contrast), 255 - (int)ofRandom(contrast));
        } else {
          color = ofColor((int)ofRandom(contrast), (int)ofRandom(contrast), (int)ofRandom(contrast));
        }
        // Random color
        // color = ofColor((int)ofRandom(150.0f)+100, (int)ofRandom(150.0f)+100, (int)ofRandom(150.0f)+100);

      }
      mesh.addColor(color);

      // add on to initial postion every loop
      initPos.x += vert.x;
      initPos.y += vert.y;
      initPos.z += vert.z;
    }

    // set average position (center)
    initPos *= mesh.getNumIndices();

};

void ofModel::disolve(float speed) {

  for (int j = 0; j < mesh.getNumIndices() - 2; j += 1) {

    ofVec3f vert = mesh.getVertex(j);

    vert.x += ofRandom(-1,1)*speed;
    vert.y += ofRandom(-1,1)*speed;
    vert.z += ofRandom(-1,1)*speed;

    mesh.setVertex(j, vert);
  }

};


void ofModel::draw() {
  mesh.draw(OF_MESH_FILL);
  // mesh.draw(OF_MESH_POINTS);
};


// OLD STUFF

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
