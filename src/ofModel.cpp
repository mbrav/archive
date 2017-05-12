#include "ofModel.h"

ofModel::ofModel() {}

ofModel::~ofModel() {}

void ofModel::setPos(ofVec3f posSet) {
  initPos = posSet;
  pos = posSet;
}

void ofModel::resetInitPos() {
  initPos = pos;
}

void ofModel::setup(string filePath) {
  pos.set(0, 0, 0);
  initPos.set(0, 0, 0);

  model.loadModel(filePath, false);
  mesh = model.getMesh(0);
  mesh.setMode(OF_PRIMITIVE_TRIANGLES);

  // randmize vertice colors
};

void ofModel::colorVertices() {
  ofColor color((int)ofRandom(25.0f), (int)ofRandom(25.0f),
                (int)ofRandom(25.0f), (int)ofRandom(25.0f));

  for (int i = 0; i < mesh.getNumIndices() - 2; i += 1) {

    // ofVec3f vert = mesh.getVertex(i);
    // vert.x += randomPos.x;
    // vert.y += randomPos.y;
    // vert.z += randomPos.z;
    //
    // mesh.setVertex(i, vert);

    int contrast = 100;
    if (i % (mesh.getNumIndices() / 50) == 0) {
      // Random contrasting colors
      float rand = ofRandom(1);
      if (rand > 0.5) {
        color = ofColor(
            255 - (int)ofRandom(contrast), 255 - (int)ofRandom(contrast),
            255 - (int)ofRandom(contrast), 255 - (int)ofRandom(contrast));
        color = ofColor((int)ofRandom(contrast), (int)ofRandom(contrast),
                        (int)ofRandom(contrast), (int)ofRandom(contrast));
      }
      // Random color
      // color = ofColor((int)ofRandom(150.0f)+100, (int)ofRandom(150.0f)+100,
      // (int)ofRandom(150.0f)+100);
    }
    mesh.addColor(color);
  }
}

void ofModel::disolve(float speed) {

  for (int j = 1; j < mesh.getNumIndices() - 1; j += 1) {

    ofVec3f vert = mesh.getVertex(j - 1);
    ofVec3f vert2 = mesh.getVertex(j);

    vert = vert2;

    mesh.setVertex(j - 1, vert);
  }
};

void ofModel::verticesDisplace() {

  // for (int j = 0; j < mesh.getNumIndices(); j += 1) {
  //
  //
  // }
}

void ofModel::draw() {
  ofPushMatrix();
    ofTranslate(pos.x, pos.y, pos.z);
    ofRotateX(rot.x);
    ofRotateY(rot.y);
    ofRotateZ(rot.z);
    mesh.draw(OF_MESH_FILL);
    // mesh.draw(OF_MESH_POINTS);
  ofPopMatrix();
}

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
//     z = (cos(ofGetElapsedTimeMillis()/213.+i)*1.3 +
//     cos(ofGetElapsedTimeMillis()/123.+j)) * 8.0;
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
