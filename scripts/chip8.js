import Renderer from './render.js';

const renderer = new Renderer(10);

let loop;

let fps = 60,
	fpsIntervals,
	startTime,
	now,
	then,
	elapsed;

/**
 * Gaming loop that runs the program
 */
function initialize() {
	fpsIntervals = 1000 / fps;
	then = Date.now();
	startTime = then;

	renderer.testRender();
	renderer.render();

	loop = requestAnimationFrame(step);
}

/**
 * Execute the process on each frame
 */
function step() {
	now = Date.now();
	elapsed = now - then;

	if (elapsed > fpsIntervals) {
		// Fill later
	}

	loop = requestAnimationFrame(step);
}

initialize();
