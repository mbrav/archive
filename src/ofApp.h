#ifndef _TEST_APP
#define _TEST_APP

#include "ofMain.h"
#include "ofxAssimpModelLoader.h"
#include "ofModel.h"

class ofApp : public ofBaseApp {

public:
  void setup();
  void update();
  void draw();

  void scene1();
  void scene1setup();
  void scene2();
  void scene2setup();
  void scene3();
  void scene3setup();
  void scene4();
  void scene4setup();
  void scene5();
  void scene5setup();
  void scene6();
  void scene6setup();
  void scene7();
  void scene7setup();
  void scene8();
  void scene8setup();
  void scene9();
  void scene9setup();

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

  // Scene1 scene1;

  const int modelFiles = 6; // number of file models
  const int modelNum = 40; // number of total models to display

  int scene;

  string titleString;
  string textString;

  vector<ofModel> models;

  vector<ofPlanePrimitive> plane;

  ofLight light;

	ofEasyCam camera;


  // loop counter
  unsigned int loop;

};

#endif
