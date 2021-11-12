## Installation

First, make sure you are running the *Raspbian* or *NOOBS* OS. After you have your Raspberry Pi up and running, make sure *pip* the python package manager is installed on your Raspberry Pi. If not type the following in Raspberry Pi's terminal.

```
$ sudo apt-get install python-pip
```  
Install [Flask](http://flask.pocoo.org/) Python microframework
```
$ sudo pip install flask
```
Now you are ready to clone the code from GitHub, type the following
```
$ git clone https://github.com/mixania/rpi-flask.git
```
Now type the ```cd``` command to open the directory
```
$ cd rpi-flask/
```
Run the server as ```sudo```(with root privileges)
```
$ sudo python switch.py
```
Your server should be running on http://127.0.0.1:80/
