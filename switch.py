from flask import Flask, render_template 
import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(4, GPIO.OUT)

app = Flask(__name__)

state = False


@app.route("/")
def main():
	return render_template('greet.html', state=state) 

@app.route("/on")
def on():
	GPIO.output(4, True)
	return render_template('greet.html', state=state) 

@app.route("/off")
def off():
	GPIO.output(4, False)
	return render_template('greet.html', state=state) 
	

if __name__ == "__main__":
	app.run(host='127.0.0.1', port=80, debug=True)

