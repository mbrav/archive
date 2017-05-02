#include "ofxAssimpModelLoader.h"

class ofModel {
public:
	ofModel();
	~ofModel();
	float x;
	void test();
	void setup(string filePath);
	void disolve(float speed);
	void draw();
private:
	ofVec3f initPos;
	ofxAssimpModelLoader model;
	ofMesh mesh;
};
