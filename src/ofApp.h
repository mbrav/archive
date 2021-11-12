#pragma once

#include "ofMain.h"

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();

		void keyPressed(int key);
		void keyReleased(int key);
		void mouseMoved(int x, int y );
		void mouseDragged(int x, int y, int button);
		void mousePressed(int x, int y, int button);
		void mouseReleased(int x, int y, int button);
		void mouseEntered(int x, int y);
		void mouseExited(int x, int y);
		void windowResized(int w, int h);
		void dragEvent(ofDragInfo dragInfo);
		void gotMessage(ofMessage msg);

		ofSoundPlayer mySound;

		// ANIMATION START TIMES
		int animation1Time;
		int animation2Time;
		int animation3Time;
		int animation4aTime;
		int animation4bTime;
		int animation4cTime;
		int animation5aTime;
		int animation5bTime;
		int animation5cTime;
		int animation6Time;
		int animation7Time;
		int animation8Time;
		int animation9Time;
		int loopCount;

		double resetTime;

		// aniamtion 1
		double  fadeIn;
		int circleSize;

		// animation 2
		double  fadeIn2;

		// animation 3
		double  var;

		// animation 4a
		double  var2;
		float rotation;

		// animation 4b and 4c
		int arrayLengths;

		// animation 5
		double  minus;

		// animation 6

		// animation 7
		float incrementalAngle;
		bool inverse;

		// animation 8
		double var3;
};
