class Speaker {
	constructor() {
		this.audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();

		// Create gain to control volume
		this.gain = this.audioContext.createGain();
		this.finish = this.audioContext.destination;

		this.gain.connect(this.finish);
	}

	play(frequency) {
		if (this.audioContext && !this.oscillator) {
			this.oscillator = this.audioContext.createOscillator();

			// Set the frequency
			this.oscillator.frequency.setValueAtTime(
				frequency || 440,
				this.audioContext.currentTime
			);

			// Square wave
			this.oscillator.type = 'square';

			this.oscillator.connect(this.gain);
			this.oscillator.start();
		}
	}

	stop() {
		if (this.oscillator) {
			this.oscillator.stop();
			this.oscillator.disconnect();
			this.oscillator = null;
		}
	}
}

export default Speaker;
