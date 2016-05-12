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
    // 1. Upload the Echo.ino sketch (in this example's Arduino/ folder) to
    //    an Arduino board.
    // 2. Check the "listDevices" call below to make sure the correct serial
    //    device is connected.  This works with OSX but may require a different
    //    port name for Linux or Windows.
    // 3. Run this app.

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
    byte = (toggle % 4) + 1;
    device.writeByte(byte);

    sniff.update();

}


void ofApp::draw()
{
    ofBackground(0, 0, 0);

    int animTime = 6000;
    int numFrames = 5;

    if (ofGetElapsedTimeMillis() % animTime < (animTime/numFrames)*1) {
      signFont.drawString("are you", 270,200);
      signFont.drawString("a free citizen?", 150,290);
    }
    else if (ofGetElapsedTimeMillis() % animTime < (animTime/numFrames)*2) {
      signFont.drawString("do you beleive in", 120,200);
      signFont.drawString("digital freedom?", 150,290);
    }
    else if (ofGetElapsedTimeMillis() % animTime < (animTime/numFrames)*3) {
      signFont.drawString("do you beleive in", 120,200);
      signFont.drawString("infrastructure?", 150,290);
    }
    else if (ofGetElapsedTimeMillis() % animTime < (animTime/numFrames)*5) {
      signFont.drawString("then connect to", 140,200);
      ofSetColor(200,255,100);
      signFont.drawString("Free_Citizen_WiFi", 120,280);
      ofSetColor(255,255,255);
    }

    sniff.draw(0,0);
    ofDrawBitmapStringHighlight("Connected to " + device.getPortName(), ofVec2f(5, ofGetHeight()-5));

}
