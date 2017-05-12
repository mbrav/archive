#include "ofxAssimpModelLoader.h"

class ofModel {
public:
  ofModel();
  ~ofModel();
  ofVec3f initPos;
  ofVec3f pos;
  ofVec3f rot;
  void setup(string filePath);
	void draw();
  void setPos(ofVec3f posSet);
  void resetInitPos();
  void disolve(float speed);
  void colorVertices();
  void verticesDisplace();

private:
  ofxAssimpModelLoader model;
  ofMesh mesh;
};
