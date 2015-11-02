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
float recordLevel = 0;
boolean visualEvent;
boolean toggle;

float x, y;

void setup()
{
  minim = new Minim(this);
  out = minim.getLineOut();
  pixelDensity(2);

  size(1000, 700, P3D);
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
    buttons.add( new Rect(10+i*24, 50, hatRow, i ) );
    buttons.add( new Rect(10+i*24, 100, snrRow, i ) );
    buttons.add( new Rect(10+i*24, 150, kikRow, i ) );
  }

  beat = 0;

  // start the sequencer
  out.setTempo( bpm );
  out.playNote( 0, 0.25f, new Tick() );

  sample = minim.loadSample("sample.mp3", 512);

  if ( sample == null ) println("Didn't get snare!");

  for (int i = 0; i < objects.length; i++) {
    objects[i] = new Bodies();
  }
}

void draw()
{
  background(0);
  stroke(255);
  noStroke();

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

  // beat marker
  rect(10+beat*24, 35, 14, 9);
}

void keyPressed()
{
  if ( key == 's' ) sample.trigger();
}

void mousePressed()
{
  for(int i = 0; i < buttons.size(); ++i)
  {
    buttons.get(i).mousePressed();
  }
}
