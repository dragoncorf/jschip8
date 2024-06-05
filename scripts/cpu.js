class CPU {
	constructor(renderer, keyboard, speaker) {
		this.renderer = renderer;
		this.keyboard = keyboard;
		this.speaker = speaker;

		// 4KB (4096 Bytes for memory)
		this.memory = new Uint8Array(4096);

		// 16 8bit registers
		this.v = new Uint8Array(16);

		// Stores memory addresses
		this.i = 0;

		// Timers
		this.delayTimer = 0;
		this.soundTimer = 0;

		// Program counter, stores the currently executing address
		this.pc = 0x200;

		// No value on propose
		this.stack = new Array();

		this.pause = false;

		this.speed = 10;
	}

	loadSpritesIntoMemory() {
		// Array of sprites with their hex value. each sprite 5 bytes
		// prettier-ignore
		const sprites = [
			0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
			0x20, 0x60, 0x20, 0x20, 0x70, // 1
			0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
			0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
			0x90, 0x90, 0xF0, 0x10, 0x10, // 4
			0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
			0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
			0xF0, 0x10, 0x20, 0x40, 0x40, // 7
			0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
			0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
			0xF0, 0x90, 0xF0, 0x90, 0x90, // A
			0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
			0xF0, 0x80, 0x80, 0x80, 0xF0, // C
			0xE0, 0x90, 0x90, 0x90, 0xE0, // D
			0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
			0xF0, 0x80, 0xF0, 0x80, 0x80  // F
		];

		// Sprites are stored in the 0x000 of the memory following the technical reference
		for (let i = 0; i < sprites.length; i++) {
			this.memory[i] = sprites[i];
		}
	}

	loadProgramIntoMemory(program) {
		for (let lineOfCode = 0; lineOfCode < program.length; lineOfCode++) {
			this.memory[0x200 + lineOfCode] = program[lineOfCode];
		}
	}

	loadRom(romName) {
		// I don't know why not parenthesis
		var request = new XMLHttpRequest();
		var self = this;

		request.onload = function () {
			if (request.response) {
				let program = new Uint8Array(request.response);

				self.loadProgramIntoMemory(program);
			}
		};

		request.open('GET', '/roms' + romName);
		request.responseType = 'arraybuffer';

		request.send();
	}

	cycle() {
		for (let i = 0; i < this.speed; i++) {
			if (!this.pause) {
				let opcode =
					(this.memory[this.pc] << 8) | this.memory[this.pc + 1];
				this.executeInstruction(opcode);
			}
		}

		if (!this.paused) {
			this.updateTimers();
		}

		this.playSound();
		this.renderer.render();
	}

	updateTimers() {
		if (this.delayTimer > 0) {
			this.delayTimer -= 1;
		}

		if (this.soundTimer > 0) {
			this.soundTimer -= 1;
		}
	}

	playSound() {
		if (this.soundTimer > 0) {
			this.speaker.play(440);
		} else {
			this.speaker.stop();
		}
	}

	executeInstruction(opcode) {
		// Each instruction is 2 bytes long, so increment it by 2.
		this.pc += 2;

		// This gets the lower 4 bits of the high byte by bitwise AND operation,
		// shifts the 8 bits to the right to leave that value alone
		let x = (opcode & 0x0f00) >> 8;

		// This gets the higher 4 bits of the low byte by bitwise AND operation,
		// shifts the 4 bits to the right to leave that value alone
		let y = (opcode & 0x00f0) >> 4;

		switch (opcode & 0xf000) {
			case 0x0000:
				switch (opcode) {
					case 0x00e0:
						this.renderer.clear();
						break;
					case 0x00ee:
						this.pc = this.stack.pop();
						break;
				}

				break;
			case 0x1000:
				this.pc = opcode & 0xfff;
				break;
			case 0x2000:
				this.stack.push(this.pc);
				this.pc = opcode & 0xfff;
				break;
			case 0x3000:
				if (this.v[x] === (opcode & 0xff)) {
					this.pc += 2;
				}
				break;
			case 0x4000:
				if (this.v[x] !== (opcode & 0xff)) {
					this.pc += 2;
				}
				break;
			case 0x5000:
				if (this.v[x] === this.v[y]) {
					this.pc += 2;
				}
				break;
			case 0x6000:
				this.v[x] = opcode & 0xff;
				break;
			case 0x7000:
				this.v[x] += opcode & 0xff;
				break;
			case 0x8000:
				switch (opcode & 0xf) {
					case 0x0:
						this.v[x] = this.v[y];
						break;
					case 0x1:
						this.v[x] |= this.v[y];
						break;
					case 0x2:
						this.v[x] &= this.v[y];
						break;
					case 0x3:
						this.v[x] ^= this.v[y];
						break;
					case 0x4:
						let sum = (this.v[x] += this.v[y]);

						this.v[0xf] = 0x0;

						if (sum > 0xff) {
							this.v[0xf] = 0x1;
						}
						break;
					case 0x5:
						break;
					case 0x6:
						break;
					case 0x7:
						break;
					case 0xe:
						break;
				}

				break;
			case 0x9000:
				break;
			case 0xa000:
				break;
			case 0xb000:
				break;
			case 0xc000:
				break;
			case 0xd000:
				break;
			case 0xe000:
				switch (opcode & 0xff) {
					case 0x9e:
						break;
					case 0xa1:
						break;
				}

				break;
			case 0xf000:
				switch (opcode & 0xff) {
					case 0x07:
						break;
					case 0x0a:
						break;
					case 0x15:
						break;
					case 0x18:
						break;
					case 0x1e:
						break;
					case 0x29:
						break;
					case 0x33:
						break;
					case 0x55:
						break;
					case 0x65:
						break;
				}

				break;

			default:
				throw new Error('Unknown opcode ' + opcode);
		}
	}
}

export default CPU;
