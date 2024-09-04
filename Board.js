export class Board {
  constructor() {
    this.port = null;       // Web Serial Port
    this.writer = null;     // Port Writer
    this.reader = null;     // Port Reader
    this.isReady = false;   // Board Ready State
    this.pins = [];         // Store Pin States
    this.firmataReady = false;
    this.logElement = null;  // Reference to the log element in the DOM
  }

  // Attach log element from DOM
  attachLogElement(logElement) {
    this.logElement = logElement;
  }

  // Internal method to log messages to the textarea
  log(data) {
    if (this.logElement) {
      this.logElement.value += data + '\n';
      this.logElement.scrollTop = this.logElement.scrollHeight;
    }
  }

  // Request and open a serial port connection
  async connect() {
    try {
      // Request the user to select a serial port
      this.port = await navigator.serial.requestPort();
      // Open the serial port with 57600 baud rate (default for Firmata)
      await this.port.open({ baudRate: 57600 });
      this.log('Serial port connected');

      this.writer = this.port.writable.getWriter();
      this.reader = this.port.readable.getReader();

      // Monitor disconnection or closure of the port
      this.monitorDisconnection();

      // Wait for the board to initialize Firmata
      await this.initializeFirmata();
    } catch (error) {
      this.log(`Error connecting to the board: ${error}`);
    }
  }

  // Initialize Firmata communication and log data
  async initializeFirmata() {
    this.log('Initializing Firmata...');
    const SYSTEM_RESET = 0xFF;

    // Send reset command to board
    await this.sendCommand([SYSTEM_RESET]);

    try {
      // Continuously listen for data from the board
      while (true) {
        const { value, done } = await this.reader.read(); // Read incoming serial data
        if (done) break; // If reader is done, break out of the loop

        // Convert byte data to hexadecimal and log it
        const hexValue = Array.from(value).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        this.log(`Received: ${hexValue}`);  // Log to the webpage

        // Check if the first byte matches the REPORT_VERSION command (0xF9)
        if (value[0] === 0xF9) { // REPORT_VERSION command
          this.isReady = true; // Mark board as ready
          this.log('Firmata is ready');
          break; // Exit the loop once the board is ready
        }
      }
    } catch (error) {
      this.handleError(error, 'Error during Firmata initialization');
    }
  }

  // Monitor disconnection of the device
  monitorDisconnection() {
    if (this.port) {
      this.port.addEventListener('disconnect', async () => {
        console.log('Device disconnected');
        await this.cleanUp();
      });
    }

    // Handle browser refresh (cleanup before unload)
    window.addEventListener('beforeunload', async () => {
      await this.cleanUp();
    });
  }

  // Clean up the serial communication (close ports, release resources)
  async cleanUp() {
    try {
      if (this.writer) {
        await this.writer.close();
        this.writer = null;
      }

      if (this.reader) {
        await this.reader.cancel();
        await this.reader.releaseLock();
        this.reader = null;
      }

      if (this.port) {
        await this.port.close();
        this.port = null;
      }

      this.log('Serial port closed and cleaned up');
    } catch (error) {
      this.log(`Error during cleanup: ${error}`);
    }
  }

  // Send commands over serial
  async sendCommand(commandArray) {
    try {
      const command = new Uint8Array(commandArray);
      await this.writer.write(command);
      this.log(`Sent: ${commandArray.map(byte => byte.toString(16).padStart(2, '0')).join(' ')}`);
    } catch (error) {
      this.log(`Error sending command to board: ${error}`);
    }
  }

  // Set pin mode
  async setPinMode(pin, mode) {
    const SET_PIN_MODE = 0xF4;
    await this.sendCommand([SET_PIN_MODE, pin, mode]);
  }

  // Digital write to a pin
  async digitalWrite(pin, value) {
    const DIGITAL_WRITE = 0x90;
    const port = Math.floor(pin / 8);
    const bit = 1 << (pin % 8);

    // Update internal pin state
    if (value) {
      this.pins[port] |= bit;
    } else {
      this.pins[port] &= ~bit;
    }

    const message = [DIGITAL_WRITE | port, this.pins[port] & 0x7F, (this.pins[port] >> 7) & 0x7F];

    // Log the command to be sent
    this.log(`Sending: ${message.map(byte => byte.toString(16).padStart(2, '0')).join(' ')}`);
    
    // Send the command to the board
    await this.sendCommand(message);

    // Log after sending the command
    this.log(`Command sent to set pin ${pin} to ${value ? 'HIGH' : 'LOW'}`);
  }
}