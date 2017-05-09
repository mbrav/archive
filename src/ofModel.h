#include "ofxAssimpModelLoader.h"

class ofModel {
public:
	ofModel();
	~ofModel();
	ofVec3f initPos;
	ofVec3f pos;
	ofVec3f rot;
	void test();
	void setup(string filePath, bool setVerticeColor);
	void setPos(ofVec3f posSet);
	void disolve(float speed);
	void vDisplace();
	void draw();
private:
	ofxAssimpModelLoader model;
	ofMesh mesh;
};
