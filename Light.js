// Light.js
export class Light {
    constructor(board, pin) {
        this.board = board;
        this.pin = pin;
    }

    // Set the pin mode to ANALOG (0x02)
    async initialize() {
        const ANALOG_MODE = 0x02;
        await this.board.setPinMode(this.pin, ANALOG_MODE);
        // Enable Analog Reporting for this pin
        const ENABLE_ANALOG_REPORTING = 0xC0 | this.pin;
        await this.board.sendCommand([ENABLE_ANALOG_REPORTING, 1]);
    }

    // Start reading analog data from the light sensor
    async readLightLevel(callback) {
        const ANALOG_MESSAGE = 0xE0 | this.pin;

        // Helper function to extract the relevant part of the message
        const parseAnalogMessage = (value) => {
            // Firmata sends 3-byte analog messages: [ANALOG_MESSAGE | pin, LSB, MSB]
            if (value[0] === ANALOG_MESSAGE) {
                const analogValue = (value[1] | (value[2] << 7)); // Reconstruct the analog value from the two bytes
                return analogValue;
            }
            return null;
        };

        // Continuous loop for reading analog data from the board
        const readLoop = async () => {
            while (true) {
                try {
                    const { value, done } = await this.board.reader.read(); // Read incoming data from the board
                    if (done) break; // Exit loop if done

                    // Parse and extract analog value
                    const analogValue = parseAnalogMessage(value);

                    if (analogValue !== null && analogValue > 100) {
                        callback(analogValue); // Pass the analog value to the callback
                    } else {
                        handleNonAnalogMessage(value);
                    }
                } catch (error) {
                    console.error('Error in read loop:', error);
                    break;
                }
            }
        };

        // Function to handle non-analog messages
        function handleNonAnalogMessage(value) {
            const command = value[0];

            // Digital Message Handling (0x90 to 0x9F)
            if ((command & 0xF0) === 0x90) {
                const port = command & 0x0F;
                const portValue = value[1] | (value[2] << 7);
                console.log(`Digital Message: Port ${port}, Value: ${portValue}`);

                // Handle the digital port value here, e.g., log the state of the pins
                return;
            }

            // Report Version (0xF9)
            if (command === 0xF9) {
                const majorVersion = value[1];
                const minorVersion = value[2];
                console.log(`Firmware Version: ${majorVersion}.${minorVersion}`);
                return;
            }

            // System Reset (0xFF)
            if (command === 0xFF) {
                console.log('System Reset received');
                return;
            }

            // Sysex Message Handling (0xF0 to 0xF7)
            if (command === 0xF0) {
                handleSysexMessage(value);
                return;
            }

            // // If no match, it's an unknown message
            // console.log('Unknown non-analog message:', value);
        }

        // Helper function to handle sysex messages
        function handleSysexMessage(value) {
            const sysexCommand = value[1];

            // Example: String message handling (sysexCommand = 0x71)
            if (sysexCommand === 0x71) {
                const stringData = String.fromCharCode.apply(null, value.slice(2, -1)); // Convert bytes to string
                console.log('Sysex String Message:', stringData);
                return;
            }

            // Add more sysex command handling as needed
            console.log('Sysex message received, command:', sysexCommand);
        }


        // Start the continuous read loop
        readLoop().catch(error => console.error('Error reading light sensor:', error));
    }
}
