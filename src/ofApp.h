#ifndef _TEST_APP
#define _TEST_APP

#include "ofMain.h"
#include "ofVboMesh.h"
#include "ofxAssimpModelLoader.h"

class ofApp : public ofBaseApp {

public:
  void setup();
  void update();
  void draw();

  void keyPressed(int key);
  void keyReleased(int key);
  void mouseMoved(int x, int y);
  void mouseDragged(int x, int y, int button);
  void mousePressed(int x, int y, int button);
  void mouseReleased(int x, int y, int button);
  void mouseEntered(int x, int y);
  void mouseExited(int x, int y);
  void windowResized(int w, int h);
  void dragEvent(ofDragInfo dragInfo);
  void gotMessage(ofMessage msg);

  ofxAssimpModelLoader model;

  const int modelNum = 10;
  // ofxAssimpModelLoader models[10];

  vector<ofxAssimpModelLoader> models;
  // vector<ofMesh> meshes;

  // ofMesh meshes[10];

  // ofMesh mesh;
  ofLight light;

	ofLight areaLight;
	ofEasyCam camera;
	ofMaterial materialPlane;

	ofVec2f lightRot;

	vector<ofPoint> points;
	int randomInts [100];

};

#endif
