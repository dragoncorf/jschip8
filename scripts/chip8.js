import Renderer from './render.js';
import Keyboard from './keyboard.js';
import Speaker from './speaker.js';
import CPU from './cpu.js';

const renderer = new Renderer(10);
const keyboard = new Keyboard();
const speaker = new Speaker();
const cpu = new CPU(renderer, keyboard, speaker);

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

	cpu.loadSpritesIntoMemory();
	cpu.loadRom('BLITZ');

	loop = requestAnimationFrame(step);
}

/**
 * Execute the process on each frame
 */
function step() {
	now = Date.now();
	elapsed = now - then;

	if (elapsed > fpsIntervals) {
		cpu.cycle();
	}

	loop = requestAnimationFrame(step);
}

initialize();
