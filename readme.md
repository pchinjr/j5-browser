# Web Serial + Firmata LED & Light Sensor Project

## Overview

This project is a basic implementation of a Web Serial API interface that communicates with an Arduino board using the **Firmata** protocol. The goal is to control an LED and read values from a light sensor, displaying the sensor data visually by mapping light levels to the opacity of an image on a webpage. 

The project uses modern JavaScript features to interface directly with the Arduino, allowing users to control an LED and visualize light sensor readings via the Web Serial API, all through their browser without needing extra software.

## Features

- **Connect to an Arduino**: Using the Web Serial API, the browser directly communicates with the Arduino.
- **Control an LED**: Use buttons on the webpage to turn an LED connected to pin 13 on and off.
- **Read Light Sensor Values**: Analog readings from a light sensor connected to pin A2 (pin 2) are collected and displayed.
- **Visual Feedback**: The light levels control the opacity of an image of Nicolas Cage as Superman, creating a real-time interactive experience.
- **Serial Monitor**: Real-time log of serial communication between the browser and the Arduino.

## Technologies Used

- **Web Serial API**: Allows direct communication between the browser and the Arduino via the serial port.
- **Firmata Protocol**: Used for sending commands to the Arduino and receiving data.
- **HTML/CSS/JavaScript**: Provides the interface, control logic, and visualization.
- **Arduino Uno**: Microcontroller used for LED control and light sensor readings.

## Hardware Requirements

- **Arduino Uno**
- **LED** (connected to pin 13)
- **Photoresistor** (light sensor connected to analog pin A2)
- **Resistors** for the LED and light sensor
- USB cable to connect the Arduino to your computer

## Setup Instructions

1. **Clone the repository**: 
   ```bash
   git clone <repo-url>
   ```
2. **Upload Firmata to your Arduino**:
   - Open the Arduino IDE.
   - Go to **File** > **Examples** > **Firmata** > **StandardFirmata**.
   - Select your board and port, then upload the sketch.
   
3. **Open the `index.html` in your browser**:
   - Ensure you use a browser that supports the **Web Serial API** (currently Chrome, Edge).
   - Click **Connect** to start the interaction with the Arduino.

## How It Works

1. **Connecting to the Arduino**:
   - Clicking the "Connect" button opens a serial port connection between the browser and Arduino.
   - The system then initializes the Firmata protocol to communicate with the Arduino.

2. **LED Control**:
   - The "LED On" and "LED Off" buttons control the state of an LED connected to pin 13 of the Arduino.

3. **Light Sensor Readings**:
   - The project reads analog input from a photoresistor connected to pin A2 (analog pin 2).
   - These readings (ranging from 0–1023) are displayed on the webpage.
   - The light level is also mapped to the opacity of the **cage-superman.jpg** image.

4. **Serial Monitor**:
   - A textarea on the webpage logs the communication between the browser and Arduino, showing each command sent and received in real time.

## Code Breakdown

### 1. **Board.js**
This class handles the main communication with the Arduino using the Web Serial API and Firmata protocol. Key methods include:
- `connect()`: Establishes the serial connection and initializes Firmata.
- `digitalWrite()`: Sends commands to turn an LED on or off.
- `startAnalogRead()`: Reads analog input from the light sensor and logs values.

### 2. **Led.js**
This class represents the LED connected to the Arduino. It provides two main methods:
- `on()`: Turns the LED on.
- `off()`: Turns the LED off.

### 3. **Light.js**
This class is responsible for reading the light levels from the photoresistor sensor. It initializes the sensor pin and continuously reads values using the Firmata protocol.

### 4. **index.html**
The interface includes:
- Buttons to connect, turn on/off the LED.
- A serial monitor that logs communication.
- A light sensor value display and an image whose opacity changes based on the light sensor readings.

### Example of Mapping Light Sensor Values:
```js
await lightSensor.readLightLevel((lightValue) => {
  // Update light level on the page
  lightLevelElement.textContent = lightValue;

  // Map the light value (1-1023) to opacity (0-1)
  const opacity = lightValue / 1023;
  cageImg.style.opacity = opacity;
});
```

### Error Handling & Cleanup
- Disconnects are monitored to prevent resource leaks.
- Cleanup operations close the serial connection and release locks when the browser tab is refreshed or closed.

## Styling

The webpage uses modern CSS to create a clean, responsive layout. The elements are styled with modern, minimalist aesthetics, with bold colors and smooth transitions to enhance the user experience. The **cage-superman.jpg** image is displayed with varying opacity, reflecting the real-time light sensor readings.

## Future Enhancements

- **Add more sensor types**: Expand the project to handle temperature, motion, and more.
- **Advanced visualizations**: Introduce more dynamic visual feedback using CSS animations.
- **Mobile support**: Adapt the project for mobile browsers that support Web Serial API.

## Praise for Cage
This project visually represents **Nicolas Cage as Superman**. As the room’s light level changes, the image of Cage fades in and out, reflecting the ambient environment. This homage to the long-lost Superman performance of Nicolas Cage creates a dramatic flair for every coding session.

---

### Credits

- Nicolas Cage as Superman image from [various fan archives].
- Built using the **Firmata protocol** and **Web Serial API**.

