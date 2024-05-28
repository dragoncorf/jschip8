/**
 * Handles Pixel and canvas management
 */
class Renderer {
	/**
	 * Creates an instance of Renderer.
	 *
	 * @constructor
	 * @param {number} scale - scale of the size of the canvas to draw the pixels
	 */
	constructor(scale = 5) {
		this.columns = 64;
		this.rows = 32;
		this.scale = scale;
		/**
		 * @type {number[]} - represents display of the canvas on a single array of all the rows and columns
		 */
		this.display = new Array(this.columns * this.rows);

		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.width = this.columns * this.scale;
		this.canvas.height = this.columns * this.scale;
	}

	/**
	 * Sets information of if a pixel should or shouldn't be drawn
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean} returns true if a pixel was erased and false if nothing was erased
	 */
	setPixel(x, y) {
		if (x > this.columns) {
			x -= this.columns;
		} else if (x < 0) {
			x += this.columns;
		}

		if (y > this.rows) {
			y -= this.rows;
		} else if (y < 0) {
			y += this.rows;
		}

		// This is the position in the display that is an array of the columns and rows combined
		// prettier-ignore
		let pixelLocation = x + (y * this.columns);
		// If there was a 1 it changes it to 0 with an XOR, if it was a 0 it changes it to 1.
		this.display[pixelLocation] ^= 1;

		return !this.display[pixelLocation];
	}

	/**
	 * Clears the current display by reinitializing it.
	 */
	clear() {
		this.display = new Array(this.columns * this.rows);
	}

	/**
	 * Renders the pixels in the canvas, Runs 60 times per second
	 */
	render() {
		// Clears the display each time it renders
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Loop through our display array
		for (let i = 0; i < this.display.length; i++) {
			// Don't understand this two lines yet
			let x = (i % this.columns) * this.scale;
			let y = Math.floor(i / this.columns) * this.scale;

			// If the display array has a 1 in i, draws the pixel
			if (this.display[i]) {
				this.context.fillStyle = '#000';
				// Draws the pixel in the position (x, y) with the scale size
				this.context.fillRect(x, y, this.scale, this.scale);
			}
		}
	}

	testRender() {
		this.setPixel(0, 0);
		this.setPixel(5, 5);
		this.setPixel(9, 9);
	}
}

export default Renderer;
