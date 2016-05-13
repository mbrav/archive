// =============================================================================
//
// Copyright (c) 2014-2016 Christopher Baker <http://christopherbaker.net>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// =============================================================================

#include "ofApp.h"


void ofApp::setup()
{
    ofSetVerticalSync(true);
    ofBackground(255, 255, 255);

    std::vector<ofx::IO::SerialDeviceInfo> devicesInfo = ofx::IO::SerialDeviceUtils::listDevices();

    ofLogNotice("ofApp::setup") << "Connected Devices: ";

    for (std::size_t i = 0; i < devicesInfo.size(); ++i)
    {
        ofLogNotice("ofApp::setup") << "\t" << devicesInfo[i];
    }

    if (!devicesInfo.empty())
    {
        // Connect to the first matching device.
        bool success = device.setup(devicesInfo[0], 115200);

        if(success)
        {
            ofLogNotice("ofApp::setup") << "Successfully setup " << devicesInfo[0];
        }
        else
        {
            ofLogNotice("ofApp::setup") << "Unable to setup " << devicesInfo[0];
        }
    }
    else
    {
        ofLogNotice("ofApp::setup") << "No devices connected.";
    }


    signFont.loadFont("Inconsolata.otf", 50);
    TowerClip.load("ExploitationOfUtopia480.mov");
    TowerClip.setLoopState(OF_LOOP_NORMAL);
    TowerClip.play();
}


void ofApp::update()
{
  loops ++;
    // The serial device can throw exeptions.
    try
    {
        // Read all bytes from the device;
        uint8_t buffer[1024];

        while (device.available() > 0)
        {
            std::size_t sz = device.readBytes(buffer, 1024);

            for (std::size_t i = 0; i < sz; ++i)
            {
                std::cout << buffer[i];
            }
        }

        // Send some new bytes to the device to have them echo'd back.
        // std::string text = "Frame Number: " + ofToString(ofGetFrameNum());
        //
        // ofx::IO::ByteBuffer textBuffer(text);

        // device.writeBytes(textBuffer);
        // device.writeByte('\n');
    }
    catch (const std::exception& exc)
    {
        ofLogError("ofApp::update") << exc.what();
    }

    // Pattern swap
    if (loops % 200 == 0) toggle++;

    byte = 1;
    device.writeByte(byte);

    TowerClip.update();
}


void ofApp::draw()
{
    TowerClip.draw(0,0);

    int currentFrameN = TowerClip.getCurrentFrame();
    // amountof frames to wait befroe animation starts
    int framesBeforeStart = 300;
    int animTime = 600;
    int numFrames = 9;

    ofSetColor(0,0,0);



    // don't overlay Viedo's credits
    if (TowerClip.getCurrentFrame() > framesBeforeStart) {
      if (((currentFrameN - framesBeforeStart) % animTime) < (animTime/numFrames)*1) {
        signFont.drawString("are you", 270,200);
        signFont.drawString("a free citizen?", 150,290);
      }
      else if (((currentFrameN - framesBeforeStart) % animTime) < (animTime/numFrames)*2) {
        signFont.drawString("do you beleive in", 120,200);
        signFont.drawString("digital freedom?", 150,290);
      }
      else if (((currentFrameN - framesBeforeStart) % animTime) < (animTime/numFrames)*3) {
        signFont.drawString("do you trust", 180,200);
        signFont.drawString("infrastructure?", 150,290);
      }
      else if (((currentFrameN - framesBeforeStart) % animTime) < (animTime/numFrames)*4) {
        ofSetColor(255,189,40);
        signFont.drawString("of course you do", 120,250);
        ofSetColor(0,0,0);
      }
      else if (((currentFrameN - framesBeforeStart) % animTime) < (animTime/numFrames)*6) {
        signFont.drawString("connect to", 220,200);
        ofSetColor(255,189,40);
        signFont.drawString("Free-Citizen-WiFi", 120,280);
        ofSetColor(0,0,0);
      }
      else if (((currentFrameN - framesBeforeStart) % animTime) < (animTime/numFrames)*8) {
        signFont.drawString("password", 260,200);
        ofSetColor(255,189,40);
        signFont.drawString("1234567890", 220,280);
      }
      else if (((currentFrameN - framesBeforeStart) % animTime) < (animTime/numFrames)*9) {
        ;
      }
    }

    ofSetColor(255,255,255);

      // ofDrawBitmapString("frame: " + ofToString(TowerClip.getCurrentFrame()) + "/"+ofToString(TowerClip.getTotalNumFrames()),20,380);

    // ofDrawBitmapStringHighlight("Connected to " + device.getPortName(), ofVec2f(5, ofGetHeight()-5));

}
