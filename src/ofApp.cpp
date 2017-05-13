#include "ofApp.h"

/*
███████ ███████ ████████ ██    ██ ██████
██      ██         ██    ██    ██ ██   ██
███████ █████      ██    ██    ██ ██████
     ██ ██         ██    ██    ██ ██
███████ ███████    ██     ██████  ██
*/

void ofApp::setup() {
  doShader = true;
  showDescription = true;

  unatendedTime = 60000; // 1 munute after no interaction

  // TEXTS STUFF
  darkText = ofColor(30);
  lightText = ofColor(220);

  ptMonoProjectTitle.load("pt-mono.ttf", 48, true, true);
  ptMonoProjectTitle.setLineHeight(48.0f);
  ptMonoProjectTitle.setLetterSpacing(1.037);

  ptMonoProjectSubTitle.load("pt-mono.ttf", 28, true, true);
  ptMonoProjectSubTitle.setLineHeight(28.0f);
  ptMonoProjectSubTitle.setLetterSpacing(1.037);

  ptMono.load("pt-mono.ttf", 12, true, true);
  ptMono.setLineHeight(18.0f);
  ptMono.setLetterSpacing(1.037);

  // #ifdef TARGET_OPENGLES
  // shader.load("shaders_gles/noise.vert","shaders_gles/noise.frag");
  // #else
  // if(ofIsGLProgrammableRenderer()){
  // 	shader.load("shaders_gl3/noise.vert", "shaders_gl3/noise.frag");
  // }else{
  // 	shader.load("shaders/noise.vert", "shaders/noise.frag");
  // }
  // #endif

  //shaders
  shader.load("shaders/noise.vert", "shaders/noise.frag");
  shader2.load("shaders/venus.vert", "shaders/venus.frag");
  shader3.load("shaders/venus2.vert", "shaders/venus2.frag");
  shader4.load("shaders/world-of-waves.vert", "shaders/world-of-waves.frag");
  shader5.load("shaders/tearlines.vert", "shaders/tearlines.frag");
  shader6.load("shaders/star-nest.vert", "shaders/star-nest.frag");

  shaders.push_back(shader);
  shaders.push_back(shader2);
  shaders.push_back(shader3);
  shaders.push_back(shader4);
  shaders.push_back(shader5);
  shaders.push_back(shader6);

  // ofSetLogLevel(OF_LOG_VERBOSE);
  ofBackground(130);

  ofDisableArbTex(); // we need GL_TEXTURE_2D for our model coords.

  ofBackground(0, 0, 0);

  camera.setFarClip(20000);
  // camera.move(0,0,15000);

  scene = 0; // set scene to one
  prevScene = 0;

  for (unsigned int i = 0; i < modelNum; i++) {

    ofModel myModelTemp;
    myModelTemp.setup("m" + ofToString(i % modelFiles + 1) + ".stl");
    myModelTemp.colorVertices(ofColor(255));
    myModelTemp.setPos(
        ofVec3f(ofRandom(-100, 100), ofRandom(-100, 100), ofRandom(-100, 100)));
    models.push_back(myModelTemp);
  }

  // draw models in a grid
  for (unsigned int i = 0; i < (int)sqrt(modelNum); i++) {
    // acount the remainer if the number is not a sqaure root
    for (unsigned int j = 0; j < (int)sqrt(modelNum); j++) {
      models[i * j].setPos(ofVec3f(i * 50, j * 50, 0));
      models[i * j].resetInitPos();

      cout << i << j << endl;
    }
  }
}

/*
██    ██ ██████  ██████   █████  ████████ ███████
██    ██ ██   ██ ██   ██ ██   ██    ██    ██
██    ██ ██████  ██   ██ ███████    ██    █████
██    ██ ██      ██   ██ ██   ██    ██    ██
 ██████  ██      ██████  ██   ██    ██    ███████
*/

void ofApp::update() {

  // set to welcome screen when innactive for some time
  if (ofGetElapsedTimeMillis() > 5000 + unatendedTime) {
    scene = 0;
    timer1 = ofGetElapsedTimeMillis();
  }

  // cout << camera.getDrag() << endl;

  PROFILE_BEGIN("Update");
  // if a scene changed, run the setup for the new scene
  if (scene == 0) {
    if (prevScene != scene) {
      cout << "scene 0: SETUP!" << endl;
      scene0setup();
      prevScene = scene;
    } else {
      scene0update();
    }
  } else if (scene == 1) {
    if (prevScene != scene) {
      cout << "scene 1: SETUP!" << endl;
      scene1setup();
      prevScene = scene;
    } else {
      scene1update();
    }
  } else if (scene == 2) {
    if (prevScene != scene) {
      cout << "scene 2: SETUP!" << endl;
      scene2setup();
      prevScene = scene;
    } else {
      scene2update();
    }
  } else if (scene == 3) {
    if (prevScene != scene) {
      cout << "scene 3: SETUP!" << endl;
      scene3setup();
      prevScene = scene;
    } else {
      scene3update();
    }
  } else if (scene == 4) {
    if (prevScene != scene) {
      cout << "scene 4: SETUP!" << endl;
      scene4setup();
      prevScene = scene;
    } else {
      scene4update();
    }
  } else if (scene == 5) {
    if (prevScene != scene) {
      cout << "scene 5: SETUP!" << endl;
      scene5setup();
      prevScene = scene;
    } else {
      scene5update();
    }
  } else if (scene == 6) {
    if (prevScene != scene) {
      cout << "scene 6: SETUP!" << endl;
      scene8setup();
      prevScene = scene;
    } else {
      scene8update();
    }
  } else if (scene == 7) {
    if (prevScene != scene) {
      cout << "scene 7: SETUP!" << endl;
      scene7setup();
      prevScene = scene;
    } else {
      scene7update();
    }
  } else if (scene == 8) {
    if (prevScene != scene) {
      cout << "scene 8: SETUP!" << endl;
      scene8setup();
      prevScene = scene;
    } else {
      scene8update();
    }
  } else if (scene == 9) {
    if (prevScene != scene) {
      cout << "scene 9: SETUP!" << endl;
      scene9setup();
      prevScene = scene;
    } else {
      scene9update();
    }
  }

  PROFILE_END();

  // count loop
  loop++;
}

/*
██████  ██████   █████  ██     ██
██   ██ ██   ██ ██   ██ ██     ██
██   ██ ██████  ███████ ██  █  ██
██   ██ ██   ██ ██   ██ ██ ███ ██
██████  ██   ██ ██   ██  ███ ███
*/

void ofApp::draw() {

  PROFILE_BEGIN("Draw");

  if (scene == 0) {
    scene0();
  } else if (scene == 1) {
    scene1();
  } else if (scene == 2) {
    scene2();
  } else if (scene == 3) {
    scene3();
  } else if (scene == 4) {
    scene4();
  } else if (scene == 5) {
    scene5();
  } else if (scene == 6) {
    scene6();
  } else if (scene == 7) {
    scene7();
  } else if (scene == 8) {
    scene8();
  } else if (scene == 9) {
    scene9();
  }

  PROFILE_END();

  // scene description
  if (showDescription && scene != 0) {
    // ofDrawRectangle(200, 200, 200, 200);
    int margin = 10;

    // text caption
    ofRectangle textRect =
        ptMono.getStringBoundingBox(textString, 20, ofGetHeight() - 300);
    ofSetColor(darkText);
    ofDrawRectangle(textRect.x - margin, textRect.y - margin * 2,
                    textRect.width + margin * 2, textRect.height + margin * 3);
    ofSetColor(lightText);
    ptMono.drawString(textString, 20, ofGetHeight() - 300);

    // title
    ofRectangle textRectTitle =
        ptMono.getStringBoundingBox(titleString, 20, ofGetHeight() - 340);
    ofSetColor(lightText);
    ofDrawRectangle(textRectTitle.x - margin, textRectTitle.y - margin,
                    textRectTitle.width + margin * 2,
                    textRectTitle.height + margin * 2);
    ofSetColor(darkText);
    ptMono.drawString(titleString, 20, ofGetHeight() - 340);

    ofDrawBitmapStringHighlight("FPS " + ofToString(ofGetFrameRate()), 20, 20);
  }

  // ofGetWidth()/2-40, ofGetHeight()/2-30, ofColor(200), ofColor(50));

  // output profile
  cout << ofxProfiler::getResults();
}

/*
██ ███    ██ ████████ ██████   ██████
██ ████   ██    ██    ██   ██ ██  ████
██ ██ ██  ██    ██    ██████  ██ ██ ██
██ ██  ██ ██    ██    ██   ██ ████  ██
██ ██   ████    ██    ██   ██  ██████
*/

void ofApp::scene0setup() {
  ofBackground(255, 255, 255, 255);
  ofSetColor(20, 20, 20, 255);

  // ofEnableDepthTest();
  // ofDisableDepthTest();
  // light.enable();
}

void ofApp::scene0update() {}

void ofApp::scene0() {

  // toggle throught all the shaders
  // int si = (ofGetElapsedTimeMillis()*1000)%sizeof(shaders);

  if (doShader) {
    shader6.begin();
    // we want to pass in some varrying values to animate our type / color
    shader6.setUniform1f("u_time", ofGetElapsedTimef());
    shader6.setUniform2f("u_resolution", ofGetWidth(), ofGetHeight());

    shader6.setUniform1f("zoom", sin(ofGetElapsedTimeMillis()/10000.));
  }

  ofRect(0, 0, ofGetWidth(), ofGetHeight());

  if (doShader) {
    shader6.end();
  }


  // TITLE AND SUBITILE

  int margin = 30;
  float float1 = cos(ofGetElapsedTimef()/2.3245) * 30;
  float float2 = sin(ofGetElapsedTimef()/1.2345) * 20;
  float float3 = sin(ofGetElapsedTimef()/1.7312) * 10;
  // ofSetRectMode(OF_RECTMODE_CENTER); //set rectangle mode to the center

  ofRectangle textRectTitle =
      ptMonoProjectTitle.getStringBoundingBox("Digital Archeaology", ofGetWidth()/2-370, ofGetHeight()/2 - 100 - float1);
  ofSetColor(lightText);
  ofDrawRectangle(textRectTitle.x - margin, textRectTitle.y - margin,
                  textRectTitle.width + margin * 2,
                  textRectTitle.height + margin * 2);
  ofSetColor(darkText);
  ptMonoProjectTitle.drawString("Digital Archeaology", ofGetWidth()/2-370, ofGetHeight()/2 - 100 - float1);

  margin = 10;

  // subtitle
  ofRectangle textRectSubTitle =
      ptMonoProjectSubTitle.getStringBoundingBox("by Michael Braverman", ofGetWidth()/2-200, ofGetHeight()/2 - float2);
  ofSetColor(darkText);
  ofDrawRectangle(textRectSubTitle.x - margin, textRectSubTitle.y - margin,
                  textRectSubTitle.width + margin * 2,
                  textRectSubTitle.height + margin * 2);
  ofSetColor(lightText);
  ptMonoProjectSubTitle.drawString("by Michael Braverman", ofGetWidth()/2-200, ofGetHeight()/2 - float2);


  // instruction
  textRectSubTitle =
      ptMono.getStringBoundingBox("Press SPACE to begin your journey", ofGetWidth()/2-150, ofGetHeight()/2 + 200 - float3);
  ofSetColor(lightText);
  ofDrawRectangle(textRectSubTitle.x - margin, textRectSubTitle.y - margin,
                  textRectSubTitle.width + margin * 2,
                  textRectSubTitle.height + margin * 2);
  ofSetColor(darkText);
  ptMono.drawString("Press SPACE to begin your journey", ofGetWidth()/2-150, ofGetHeight()/2 + 200 - float3);

  // light.disable();
  // ofDisableLighting();

  camera.begin();

  camera.end();

  PROFILE_END();

}

/*
███████  ██████ ███████ ███    ██ ███████  ██
██      ██      ██      ████   ██ ██      ███
███████ ██      █████   ██ ██  ██ █████    ██
     ██ ██      ██      ██  ██ ██ ██       ██
███████  ██████ ███████ ██   ████ ███████  ██
*/

void ofApp::scene1setup() {

  PROFILE_BEGIN("Scene 1 setup()");
  for (unsigned int i = 0; i < modelNum; i++) {

    models[i].colorVertices(ofColor(1.0, 1.0, 1.0, 1.0));
  }

  ofBackground(255, 255, 255, 255);
  ofSetColor(20, 20, 20, 255);

  ofEnableDepthTest();
  // light.enable();
  ofEnableSeparateSpecularLight();
  PROFILE_END();
}

void ofApp::scene1update() { modelOrbitRotate(); }

void ofApp::scene1() {
  PROFILE_BEGIN("Scene 2 draw()");
  titleString = "SCENE I — The Cosmos";
  textString =
      " When we take a glimpse into the night sky, most of us rarely \n "
      "realize that we are looking at history. Whatever we see in the \n "
      "night sky, is a collection of photons that traveled for thousands \n "
      "and millions of years from their point of origin. The photons coming "
      "\n "
      "from Alpha Centauri for example, which is our closest neighboring \n "
      "stellar system, is already 4.3 years old by the time it reaches our "
      "\n "
      "telescopes. When we look at the center of our galaxy, we see light \n "
      "that is 27,000 years old. When we observe Andromeda, our neighboring "
      "\n "
      "galaxy, we see light that is 2.5 million years old. Our night sky is "
      "\n "
      "filled with the cosmic past, and the gigabytes of data collected by "
      "all "
      "\n "
      "kinds of telescopes, have yet to be 'excavated' and reveal an alien "
      "\n "
      "civilization that may be lurking among the data. The sky, can be \n "
      "considered a opaque sediment that you can see through, and observe \n "
      "the timeline of the universe's history. Just by looking at the sky, "
      "\n "
      "we become 'observer archeologists' who are engaged in an act of \n "
      "excavating the past.";

  if (doShader) {
    shader6.begin();
    // we want to pass in some varrying values to animate our type / color
    shader6.setUniform1f("u_time", ofGetElapsedTimef());
    shader6.setUniform2f("u_resolution", ofGetWidth(), ofGetHeight());

    shader6.setUniform1f("zoom", camera.getDistance() / 500.0);
  }

  ofRect(0, 0, ofGetWidth(), ofGetHeight());

  if (doShader) {
    shader6.end();
  }

  camera.begin();

  for (unsigned int i = 0; i < modelNum; i++) {

    models[i].draw();
  }

  ofDisableDepthTest();
  light.disable();
  ofDisableLighting();

  camera.end();

  ofSetColor(255, 255, 255);
  PROFILE_END();
}

/*
███████  ██████ ███████ ███    ██ ███████     ██████
██      ██      ██      ████   ██ ██               ██
███████ ██      █████   ██ ██  ██ █████        █████
     ██ ██      ██      ██  ██ ██ ██          ██
███████  ██████ ███████ ██   ████ ███████     ███████
*/

void ofApp::scene2setup() {
  titleString = "SCENE II — The Light";
  textString = "jdl;skfjg;lsdjfgl;j";
  PROFILE_BEGIN("Scene 2 setup()");

  PROFILE_END();

  // draw models in a grid
}

void ofApp::scene2update() {
  PROFILE_BEGIN("Scene 2 update()");
  modelOrbitRotate()

      PROFILE_END();
}

void ofApp::scene2() {
  PROFILE_BEGIN("Scene 2 draw()");
  titleString = "SCENE I — The Sky";
  textString =
      " When we take a glimpse into the night sky, most of us rarely \n "
      "realize that we are looking at history. Whatever we see in the \n "
      "night sky, is a collection of photons that traveled for thousands \n "
      "and millions of years from their point of origin. The photons coming "
      "\n "
      "from Alpha Centauri for example, which is our closest neighboring \n "
      "stellar system, is already 4.3 years old by the time it reaches our "
      "\n "
      "telescopes. When we look at the center of our galaxy, we see light \n "
      "that is 27,000 years old. When we observe Andromeda, our neighboring "
      "\n "
      "galaxy, we see light that is 2.5 million years old. Our night sky is "
      "\n "
      "filled with the cosmic past, and the gigabytes of data collected by "
      "all "
      "\n "
      "kinds of telescopes, have yet to be 'excavated' and reveal an alien "
      "\n "
      "civilization that may be lurking among the data. The sky, can be \n "
      "considered a opaque sediment that you can see through, and observe \n "
      "the timeline of the universe's history. Just by looking at the sky, "
      "\n "
      "we become 'observer archeologists' who are engaged in an act of \n "
      "excavating the past.";

  ofBackground(255, 255, 255, 255);
  ofSetColor(200, 200, 200, 255);
  camera.begin();

  ofEnableDepthTest();
  // light.enable();
  ofEnableSeparateSpecularLight();

  if (doShader) {
    shader6.begin();
    // we want to pass in some varrying values to animate our type / color
    shader6.setUniform1f("u_time", ofGetElapsedTimef());
    shader6.setUniform2f("u_resolution", ofGetWidth(), ofGetHeight());

    shader6.setUniform2f("u_mouse", mouseX - ofGetWidth() / 2,
                         ofGetHeight() / 2 - mouseY);
    shader6.setUniform1f("zoom", camera.getDistance() / 500.0);
  }

  for (unsigned int i = 0; i < modelNum; i++) {

    models[i].draw();
  }

  if (doShader) {
    shader6.end();
  }

  ofDisableDepthTest();
  light.disable();
  ofDisableLighting();

  camera.end();

  PROFILE_END();
}

/*
███████  ██████ ███████ ███    ██ ███████ ██████
██      ██      ██      ████   ██ ██           ██
███████ ██      █████   ██ ██  ██ █████    █████
     ██ ██      ██      ██  ██ ██ ██           ██
███████  ██████ ███████ ██   ████ ███████ ██████
*/

void ofApp::scene3setup() {
  PROFILE_BEGIN("Scene 3 setup()");
  PROFILE_END();
}

void ofApp::scene3update() {
  PROFILE_BEGIN("Scene 3 update()");
  for (unsigned int i = 0; i < modelNum; i++) {

    models[i].setPos(
        ofVec3f(models[i].pos.x, models[i].pos.y,
                cos(ofGetElapsedTimeMillis() / (1023.25 + i * 12.235)) * 5.0));
  }
  PROFILE_END();
}

void ofApp::scene3() {
  PROFILE_BEGIN("Scene 3 draw()");
  titleString = "SCENE III — WTF";
  textString = "jdl;skfjg;lsdjfgl;j";

  ofBackground(cos(ofGetElapsedTimeMillis() / 3400.0) * 255,
               cos(ofGetElapsedTimeMillis() / 2400.0) * 255,
               cos(ofGetElapsedTimeMillis() / 4400.0) * 255, 255);
  ofSetColor(cos(ofGetElapsedTimeMillis() / 3300.0 * 255),
             cos(ofGetElapsedTimeMillis() / 1400.0 * 255),
             cos(ofGetElapsedTimeMillis() / 3600.0) * 255, 255);
  camera.begin();

  ofEnableDepthTest();
  // light.enable();
  ofEnableSeparateSpecularLight();

  // models[0].draw();

  for (unsigned int i = 0; i < modelNum; i++) {

    int randNum = (int)ofRandom(i, modelNum);

    if ((i % 3) == (randNum % 3)) {
      shader6.begin();
      // we want to pass in some varrying values to animate our type / color

      shader6.setUniform1f("u_time", ofGetElapsedTimef());
      shader6.setUniform2f("u_resolution", ofGetWidth(), ofGetHeight());

      // we also pass in the mouse position
      // we have to transform the coords to what the shader is expecting which
      // is 0,0 in the center and y axis flipped.
      shader6.setUniform2f("u_mouse", mouseX - ofGetWidth() / 2,
                           ofGetHeight() / 2 - mouseY);

      shader6.setUniform1f("zoom", camera.getDistance() / 500.0);
      // shader6.setUniform2f("rotation", camera.getDistance()/500.0);
    }

    models[i].draw();

    if (i == randNum && loop % 5 == 0) {
      shader6.end();
    }
  }

  ofDisableDepthTest();
  light.disable();
  ofDisableLighting();

  camera.end();

  PROFILE_END();
}

/*
███████  ██████ ███████ ███    ██ ███████     ██   ██
██      ██      ██      ████   ██ ██          ██   ██
███████ ██      █████   ██ ██  ██ █████       ███████
     ██ ██      ██      ██  ██ ██ ██               ██
███████  ██████ ███████ ██   ████ ███████          ██
*/

void ofApp::scene4setup() {
  PROFILE_BEGIN("Scene 4 setup()");
  PROFILE_END();
}

void ofApp::scene4update() {
  PROFILE_BEGIN("Scene 4 update()");
  PROFILE_END();
}

void ofApp::scene4() {
  PROFILE_BEGIN("Scene 4 draw()");

  ofBackground(cos(ofGetElapsedTimeMillis() / 3400.0) * 255,
               cos(ofGetElapsedTimeMillis() / 2400.0) * 255,
               cos(ofGetElapsedTimeMillis() / 4400.0) * 255, 255);
  ofSetColor(cos(ofGetElapsedTimeMillis() / 3300.0 * 255),
             cos(ofGetElapsedTimeMillis() / 1400.0 * 255),
             cos(ofGetElapsedTimeMillis() / 3600.0) * 255, 255);

  camera.begin();

  for (unsigned int i = 0; i < modelNum; i++) {
    if (doShader) {
      shader6.begin();
      // we want to pass in some varrying values to animate our type / color
      shader6.setUniform1f("u_time", ofGetElapsedTimef());
      shader6.setUniform2f("u_resolution", ofGetWidth(), ofGetHeight());

      shader6.setUniform2f("u_mouse", mouseX - ofGetWidth() / 2,
                           ofGetHeight() / 2 - mouseY);
      shader6.setUniform1f("zoom", camera.getDistance() / 500.0);
    }

    models[i].draw();

    if (doShader) {
      shader6.end();
    }
  }

  camera.end();
  PROFILE_END();
}

void ofApp::scene5setup() {}

void ofApp::scene5update() {}

void ofApp::scene5() {}

void ofApp::scene6setup() {}

void ofApp::scene6update() {}

void ofApp::scene6() {}

void ofApp::scene7setup() {}

void ofApp::scene7update() {}

void ofApp::scene7() {}

void ofApp::scene8setup() {}

void ofApp::scene8update() {}

void ofApp::scene8() {}

void ofApp::scene9setup() {}

void ofApp::scene9update() {}

void ofApp::scene9() {}

/*
███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
█████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
*/

void ofApp::modelOrbitRotate() {
  for (unsigned int i = 0; i < modelNum; i++) {
    models[i].rot.x += 0.05 * i;
    models[i].rot.y += 0.08 * i;
    models[i].rot.z += 0.07 * i;

    models[i].pos.x =
        models[i].initPos.x * cos(ofGetElapsedTimeMillis() / 1000.1);
    models[i].pos.y =
        models[i].initPos.y * sin(ofGetElapsedTimeMillis() / 1000.1);
    models[i].pos.z =
        models[i].initPos.z * sin(ofGetElapsedTimeMillis() / 1000.1) -
        cos(ofGetElapsedTimeMillis() / 1000.1);
  }
}

/*
 ██████  ██████  ███    ██ ████████ ██████   ██████  ██      ███████
██      ██    ██ ████   ██    ██    ██   ██ ██    ██ ██      ██
██      ██    ██ ██ ██  ██    ██    ██████  ██    ██ ██      ███████
██      ██    ██ ██  ██ ██    ██    ██   ██ ██    ██ ██           ██
 ██████  ██████  ██   ████    ██    ██   ██  ██████  ███████ ███████
*/

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
  // set the timer when a key is pressed

  unusedTime = ofGetElapsedTimeMillis();

  if (key == 'f')
    ofToggleFullscreen();
  if (key == '0')
    scene = 0;
  if (key == ' ')
    scene = (scene+1)%9;
  if (key == '1')
    scene = 1;
  if (key == '2')
    scene = 2;
  if (key == '3')
    scene = 3;
  if (key == '4')
    scene = 4;
  if (key == '5')
    scene = 5;
  if (key == '6')
    scene = 6;
  if (key == '7')
    scene = 7;
  if (key == '8')
    scene = 8;
  if (key == '9')
    scene = 9;
  if (key == 's')
    doShader = !doShader;
  if (key == 'd')
    showDescription = !showDescription;
  // if (key == 'q')
  //   ofExit();
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key) {}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y) {
  unusedTime = ofGetElapsedTimeMillis();
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button) {
  unusedTime = ofGetElapsedTimeMillis();
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button) {
  unusedTime = ofGetElapsedTimeMillis();
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button) {
  unusedTime = ofGetElapsedTimeMillis();
}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y) {}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y) {}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h) {
  unusedTime = ofGetElapsedTimeMillis();
}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg) {}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo) {
  unusedTime = ofGetElapsedTimeMillis();
}
