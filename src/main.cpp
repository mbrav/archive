#include "ofApp.h"
#include "ofMain.h"

//========================================================================
int main() {

  // ofSetupOpenGL(300,200, OF_WINDOW);			// <-------- setup the GL
  // context

  ofSetLogLevel(OF_LOG_VERBOSE);
  int windowWidth = 1280;
  int windowHeight = 720;

#ifdef TARGET_OPENGLES
  ofGLESWindowSettings settings;
  settings.width = windowWidth;
  settings.height = windowHeight;
  settings.setGLESVersion(2);
  ofCreateWindow(settings);
#else
  ofSetupOpenGL(windowWidth, windowHeight, OF_WINDOW);
#endif

  // this kicks off the running of my app
  // can be OF_WINDOW or OF_FULLSCREEN
  // pass in width and height too:
  ofRunApp(new ofApp());
}
