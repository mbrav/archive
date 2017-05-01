#include "ofxAssimpModelLoader.h"

class ofModel {
public:
	ofModel();
	~ofModel();
	float x;
	void test();
	void setup(string filePath);
	void update();
	void draw();
private:
	ofxAssimpModelLoader model;
	ofMesh mesh;
};
