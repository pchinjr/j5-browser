# Web Serial API + Firmata + LED Control Project

Using Johnny-Five.io as a starting point, this project allows you to control an Arduino board's LED from a web browser using the Web Serial API and the Firmata protocol. The system is set up using JavaScript, allowing users to connect to an Arduino board and toggle the onboard LED without needing additional server-side software. We've created the most basic example of how a J5 like implementation could work in the browser.

## Project Structure

### Files:

1. **index.html** - The main HTML interface for the project.
2. **Board.js** - Handles the connection, communication, and pin control for the Arduino board using the Web Serial API and Firmata protocol.
3. **Led.js** - A simple class to manage turning the LED on or off on the Arduino board.

## Features

- **Web Serial API**: Communicates with the Arduino board directly through a serial connection.
- **Firmata Protocol**: Implements the Firmata protocol to send commands to the board.
- **LED Control**: Enables turning the onboard LED on or off via two buttons in the browser interface.
- **Logging**: Logs all serial communication between the browser and the board, including sent commands and received data.

## How It Works

### Setup

The project connects to the Arduino using the browser's Web Serial API. When the "Connect" button is clicked, it prompts the user to select a serial device (the Arduino). The project initializes the Firmata protocol to communicate with the Arduino and sends commands to toggle the onboard LED.

### Components

1. **Board Class** (`Board.js`):
   - Handles connection to the Arduino through the Web Serial API.
   - Implements the Firmata protocol to send commands to the Arduino.
   - Manages the pins on the Arduino and logs communication to the webpage.
   - Contains methods like `setPinMode()` and `digitalWrite()` to control the pins.

2. **LED Class** (`Led.js`):
   - A simple abstraction to control the onboard LED of the Arduino.
   - Uses the `Board` class to send commands to turn the LED on or off.

### User Interface (`index.html`)

The webpage contains:
- A **Connect** button to establish a serial connection.
- Two buttons: **LED On** and **LED Off**, which control the onboard LED once connected.
- A text area that logs all serial communication.

## Running the Project

1. **Clone the repository** to your local machine or serve it using a simple web server (you can use the Live Server extension in VSCode or a tool like `http-server`).
   
2. **Upload StandardFirmata to your Arduino**: 
   Make sure the StandardFirmata sketch is loaded onto your Arduino. This sketch allows Firmata to communicate with the board. You can find it in the Arduino IDE under:
   `File > Examples > Firmata > StandardFirmata`.

3. **Open the `index.html` in a browser** that supports the Web Serial API (Chrome or Edge).

4. **Connect to your Arduino**:
   - Click the **Connect** button and select the serial port connected to your Arduino board.
   - Once connected, the **LED On** and **LED Off** buttons will be enabled.

5. **Control the LED**:
   - Click **LED On** to turn the onboard LED on pin 13 ON.
   - Click **LED Off** to turn it OFF.

## Example Serial Log

```
Serial port connected
Initializing Firmata...
Sent: ff
Received: f9
Firmata is ready
Sent: f4 0d 01
Sending: 91 20 00
Sent: 91 20 00
Command sent to set pin 13 to HIGH
Sending: 91 00 00
Sent: 91 00 00
Command sent to set pin 13 to LOW
```

The log shows a step-by-step account of the communication between the browser and the Arduino board, including Firmata initialization, pin mode setting, and toggling the LED.

## Error Handling

If a disconnection occurs or the webpage is refreshed, the serial communication will be cleaned up automatically, and you will need to reconnect. Errors during communication are logged to the console.

## Future Improvements

- **Add Support for More Devices**: You can extend this project to control other components like servos or sensors.
- **Error Handling and UI Feedback**: Add more feedback for errors and improve the user interface to handle various states like failed connections or communication errors.
- **Real-Time Updates**: Implement features to reflect real-time changes in the Arduino's state, such as reading inputs from sensors.