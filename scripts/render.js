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
	constructor(scale) {
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

		// Yet I don't understand
		// prettier-ignore
		let pixelLocation = x + (y * this.columns);
		this.display[pixelLocation] ^= 1;

		return !this.display[pixelLocation];
	}

	/**
	 * Clears the current display by reinitializing it.
	 */
	clear() {
		this.display = new Array(this.columns * this.rows);
	}

	render() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (let i = 0; i < this.display.length; i++) {
			let x = (i % this.columns) * this.scale;
			let y = (i / this.columns) * this.scale;

			if (this.display[i]) {
				this.context.fillStyle = '';
			}
		}
	}
}

export default Renderer;
