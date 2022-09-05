import RPi.GPIO as GPIO
import glob
import time
from flask import Flask, render_template, request
app = Flask(__name__)

GPIO.setmode(GPIO.BCM)

# create dictionary to store pins
pins = {
	5  : {'name' : 'Kettle 1', 'state' : GPIO.LOW},
	12 : {'name' : 'Kettle 2', 'state' : GPIO.LOW},
	25 : {'name' : 'Pump 1', 'state' : GPIO.LOW},
	27 : {'name' : 'Pump 2', 'state' : GPIO.LOW}
}

# Set all pins to Low
for pin in pins:
	GPIO.setup(pin, GPIO.OUT)
	GPIO.output(pin, GPIO.LOW)

# create sensor array and get attached sensors
sensors = {
}

# initial sensor setup
for sensor in glob.glob("/sys/bus/w1/devices/28-*/w1_slave"):
	newSensor = {"name" : "Temp Sensor 1", "temp" : 0.0}
	id = sensor.split("/")[5]
	sensors[id] = newSensor
	print("sensor list = ", sensors)

@app.route("/")
def main():
	# read state for each pin and store it in dictionary
	for pin in pins:
		pins[pin]['state'] = GPIO.input(pin)

	for sensor in sensors:
		try:
			sloc = "/sys/bus/w1/devices/" + sensor + "/w1_slave"
			f = open(sloc, "r")
			data = f.read()
			f.close
			if "YES" in data:
				(discard, sep, reading) = data.partition(' t=')
				t = float(reading) /1000.0
				t = t*9/5 + 32
				sensors[sensor]["temp"] = t
			else:
				sensors[sensor]["temp"] = 0
		except:
			sensors[sensor]["temp"] = "n/a"
		print(sensors)

	# put dictionary in template data dictionary
	templateData = {
		'pins' : pins,
		'sensors' : sensors
	}

	#pass the template data to main.html and return it to the user
	return render_template('main.html', **templateData)

#@app.route("/temp")
#def main():

# function below is exectured when someone requests a URL with the pin number and action in it
@app.route("/<changePin>/<action>")
def action(changePin, action):
	# convert the pin from the URL into an integer:
	changePin = int(changePin)

	deviceName = pins[changePin]["name"]

	# if the action part is on turn on pin
	if action == "on":
		GPIO.output(changePin, GPIO.HIGH)
		message = "Turned " + deviceName + " on."

	if action == "off":
		GPIO.output(changePin, GPIO.LOW)
		message = "Turned " + deviceName + " off."

	#read pin state and store in dictionary
	for pin in pins:
		pins[pin]['state'] = GPIO.input(pin)

	templateData = {
		'pins' : pins
	}

	return render_template('main.html', **templateData)


if __name__ == "__main__":
	app.run(host='0.0.0.0', port=80, debug=True)
