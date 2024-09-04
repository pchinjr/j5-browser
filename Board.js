export class Board {
    constructor() {
      this.port = null;       // Web Serial Port
      this.writer = null;     // Port Writer
      this.reader = null;     // Port Reader
      this.isReady = false;   // Board Ready State
      this.pins = [];         // Store Pin States
      this.firmataReady = false;
    }
  
    // Request and open a serial port connection
    async connect() {
      try {
        // Request the user to select a serial port
        this.port = await navigator.serial.requestPort();
        // Open the serial port with 57600 baud rate (default for Firmata)
        await this.port.open({ baudRate: 57600 });
        console.log('Serial port connected');
  
        this.writer = this.port.writable.getWriter();
        this.reader = this.port.readable.getReader();
  
        // Wait for the board to initialize Firmata
        await this.initializeFirmata();
      } catch (error) {
        console.error('Error connecting to board:', error);
      }
    }
  
    // Initialize Firmata communication
    async initializeFirmata() {
      console.log('Initializing Firmata...');
  
      // Firmata initialization commands (Report version, etc.)
      const REPORT_VERSION = 0xF9;
      const SYSTEM_RESET = 0xFF;
      const START_SYSEX = 0xF0;
      const END_SYSEX = 0xF7;
  
      // Send reset command to board
      await this.sendCommand([SYSTEM_RESET]);
  
      // Wait for Firmata's REPORT_VERSION command
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) break;
  
        // Handle incoming Firmata message
        if (value[0] === REPORT_VERSION) {
          this.isReady = true;
          console.log('Firmata is ready');
          break;
        }
      }
    }
  
    // Send commands over serial
    async sendCommand(commandArray) {
      const command = new Uint8Array(commandArray);
      await this.writer.write(command);
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
  
      // Send the command to the board
      await this.sendCommand([DIGITAL_WRITE | port, this.pins[port] & 0x7F, (this.pins[port] >> 7) & 0x7F]);
    }
  }