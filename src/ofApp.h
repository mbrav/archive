#ifndef _TEST_APP
#define _TEST_APP

#include "ofMain.h"
#include "ofModel.h"
#include "ofxAssimpModelLoader.h"

class ofApp : public ofBaseApp {

public:
  void setup();
  void update();
  void draw();

  void scene1();
  void scene1update();
  void scene1setup();
  void scene2();
  void scene2update();
  void scene2setup();
  void scene3();
  void scene3update();
  void scene3setup();
  void scene4();
  void scene4update();
  void scene4setup();
  void scene5();
  void scene5update();
  void scene5setup();
  void scene6();
  void scene6update();
  void scene6setup();
  void scene7();
  void scene7update();
  void scene7setup();
  void scene8();
  void scene8update();
  void scene8setup();
  void scene9();
  void scene9update();
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

  ofLight light;
  ofEasyCam camera;

  const int modelFiles = 6; // number of file models
  const int modelNum = 40;  // number of total models to display
  vector<ofModel> models;

  // scene control
  int scene;     // number of the scene
  int prevScene; // number of the scene
  // loop counter
  unsigned int loop;

  string titleString;
  string textString;
  bool showDescription;

  ofShader shader;
  ofShader shader2; // venus
  bool doShader;
};

#endif
