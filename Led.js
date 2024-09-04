export class Led {
    constructor(board, pin) {
      this.board = board;
      this.pin = pin;
      
      // Set the pin to OUTPUT mode
      this.board.setPinMode(pin, 0x01); // 0x01 corresponds to OUTPUT mode in Firmata
    }
  
    // Turn the LED on
    async on() {
      await this.board.digitalWrite(this.pin, 1); // Write HIGH to turn on
    }
  
    // Turn the LED off
    async off() {
      await this.board.digitalWrite(this.pin, 0); // Write LOW to turn off
    }
  }
  