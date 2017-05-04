#include "ofxAssimpModelLoader.h"

class ofModel {
public:
	ofModel();
	~ofModel();
	ofVec3f pos;
	void test();
	void setup(string filePath);
	void disolve(float speed);
	void vDisplace();
	void draw();
private:
	ofVec3f initPos;
	ofxAssimpModelLoader model;
	ofMesh mesh;
};
