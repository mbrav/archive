/**
  * This sketch demonstrates how to use the <code>loadSample</code> method of <code>Minim</code>.
  * The <code>loadSample</code> method allows you to specify the sample you want to load
  * with a <code>String</code> and optionally specify what you want the buffer size of the
  * returned <code>AudioSample</code> to be. Minim is able to load wav files, au files, aif
  * files, snd files, and mp3 files. When you call <code>loadSample</code>, if you just
  * specify the filename it will try to load the sample from the data folder of your sketch.
  * However, you can also specify an absolute path (such as "C:\foo\bar\thing.wav") and the
  * file will be loaded from that location (keep in mind that won't work from an applet).
  * You can also specify a URL (such as "http://www.mysite.com/mp3/song.mp3") but keep in mind
  * that if you run the sketch as an applet you may run in to security restrictions
  * if the applet is not on the same domain as the file you want to load. You can get around
  * the restriction by signing all of the jars in the applet.
  * <p>
  * An <code>AudioSample</code> is a special kind of file playback that allows
  * you to repeatedly <i>trigger</i> an audio file. It does this by keeping the
  * entire file in an internal buffer and then keeping a list of trigger points.
  * <code>AudioSample</code> supports up to 20 overlapping triggers, which
  * should be plenty for short sounds. It is not advised that you use this class
  * for long sounds (like entire songs, for example) because the entire file is
  * kept in memory.
  * <p>
  * Use 'k' and 's' to trigger a kick drum sample and a snare sample, respectively.
  * You will see their waveforms drawn when they are played back.
  * <p>
  * For more information about Minim and additional features,
  * visit http://code.compartmental.net/minim/
  */

import ddf.minim.*;
import ddf.minim.ugens.*;

Minim minim;
AudioSample sample;
AudioSample lead;
AudioSample bridge;
AudioOutput out;

Sampler     kick;
Sampler     snare;
Sampler     hat;

boolean[] hatRow = new boolean[16];
boolean[] snrRow = new boolean[16];
boolean[] kikRow = new boolean[16];

ArrayList<Rect> buttons = new ArrayList<Rect>();

int bpm = 85;
int beat; // which beat we're on

Bodies[] objects;

float soundLevel;
float recordLevel;
boolean visualEvent;
boolean toggle;

boolean showMachine = false;

float x, y;

void setup()
{
  minim = new Minim(this);
  out = minim.getLineOut();
  //pixelDensity(2);

  size(720, 480, P3D);
  minim = new Minim(this);
  objects = new Bodies[2000];

  kick  = new Sampler( "BD.wav", 4, minim );
  snare = new Sampler( "SD.wav", 4, minim );
  hat   = new Sampler( "CHH.wav", 4, minim );

  // patch samplers to the output
  kick.patch( out );
  snare.patch( out );
  hat.patch( out );

  for (int i = 0; i < 16; i++)
  {
    buttons.add( new Rect(10+i*24, height - 80, hatRow, i ) );
    buttons.add( new Rect(10+i*24, height - 55, snrRow, i ) );
    buttons.add( new Rect(10+i*24, height - 30, kikRow, i ) );
  }

  beat = 0;

  // start the sequencer
  out.setTempo( bpm );
  out.playNote( 0, 0.25f, new Tick() );

  sample = minim.loadSample("sample.mp3", 512);
  lead = minim.loadSample("lead.mp3", 512);
  bridge = minim.loadSample("bridge.mp3", 512);
  
  lead.setGain(-13.0);
  
  if ( sample == null ) println("Didn't get sample!");
  if ( lead == null ) println("Didn't get lead!");
  if ( bridge == null ) println("Didn't get bridge!");

  for (int i = 0; i < objects.length; i++) {
    objects[i] = new Bodies();
  }
}

void draw()
{
  background(0);
  noStroke();
  fill(255);
  
  if (millis() < 5000) {
    text("1. Press 'S', 'A' and 'D' to toggle samples.", 10, 20);
    text("2. Press the red squares to use the drum machine.", 10, 40);
    text("3. Use your mouse to interact with particels.", 10, 60);
  }
 
  for (int i = 0; i < objects.length; i++) {
    objects[i].CollisionCheck();
    if (visualEvent) {
      if (toggle) {
        objects[i].reverseGravity(true);
      } else {
        objects[i].reverseGravity(false);
      }
      objects[i].UpdateWithValue(x, y);
    } else {
      if (toggle) {
        objects[i].reverseGravity(true);
      } else {
        objects[i].reverseGravity(false);
      }
      objects[i].Update();
    }
    objects[i].Dampen();
    objects[i].Animate();
  }

  soundLevel = sample.mix.get(20);
  if (soundLevel > recordLevel) {
    recordLevel = soundLevel;
    println(soundLevel);
  }

  if (soundLevel > 0.15) {
    x = random(0, width);
    y = random(0, height);
    visualEvent = true;
    toggle = !toggle;
  } else {
    visualEvent = false;
  }

  if (showMachine) {
    // beat marker
    fill(200);
    //close square
    rect(10, height - 115, 25, 25);
    //body
    rect(0, height - 90, 400, 90);
    stroke(200);
    //beat counter
    fill(0, 255, 0);
    rect(10+beat*24, height - 12, 15, 10);
    //clear button
    noStroke();
    fill(255, 0, 0);
    rect(40, height - 108, 18, 18);
    //close cross
    stroke(255, 0, 0);
    strokeWeight(3);
    line(14, height - 94, 30, height - 110);
    line(14, height - 110, 30, height - 94);

    noStroke();

    for(int i = 0; i < buttons.size(); ++i)
    {
      buttons.get(i).draw();
    }

    stroke(128);
    if ( beat % 4 == 0 )
    {
      fill(200, 0, 0);
    }
    else
    {
      fill(0, 200, 0);
    }

  } else {
    fill(255,0,0);
    rect(10, height - 35, 25, 25);
    stroke(200);
    strokeWeight(3);
    rect(15, height - 30, 15, 15);
    noStroke();
  }
}

void keyPressed()
{
  if ( key == 'a' ) sample.trigger();
  if ( key == 's' ) lead.trigger();
  if ( key == 'd' ) bridge.trigger();
  if ( key == 'c' ) showMachine = !showMachine;
}

void mousePressed()
{
  if (showMachine) {
    for(int i = 0; i < buttons.size(); ++i)
    {
      buttons.get(i).mousePressed();
    }
    if(mouseX < 35 && mouseX > 10 && mouseY < (height - 90) && mouseY > (height - 115)) {
      showMachine = false;
    }
    if(mouseX < 60 && mouseX > 40 && mouseY < (height - 90) && mouseY > (height - 110)) {
      for (int i = 0; i < hatRow.length; i++) {
        hatRow[i] = false;
        snrRow[i] = false;
        kikRow[i] = false;
      }
    }
  } else {
    if(mouseX < 35 && mouseX > 10 && mouseY < (height - 10) && mouseY > (height - 35)) {
      showMachine = true;
    }
  }
}