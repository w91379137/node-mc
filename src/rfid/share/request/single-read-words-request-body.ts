import { BaseRequestBody } from './base-request-body';

export class SingleReadWordsRequestBody extends BaseRequestBody {

	// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

	static decode(buffer) {
		try {
			const commandCode = buffer[0]
			if (commandCode !== 0x10) {
				return null
			}

			const wordNumber = (buffer[1] & 0xf0) >> 4
			const channel = (buffer[1] & 0x0f) >> 1

			return new this(wordNumber, channel)
		} catch (e) {

			return null
		}
	}

	// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

	_wordNumber
	_channel

	// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

	constructor(wordNumber, channel) {
		super(0x10)
		this._wordNumber = wordNumber;
		// Toggle bit 目前不考慮
		this._channel = channel;
		// Word address 目前不考慮
	}

	// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

	encode() {

		const payload = Buffer.alloc(4);

		payload[0] = this._commandCode;
		payload[1] = (this._wordNumber << 4) | (this._channel << 1);

		return payload;
	}
}


// Buffer 操作
// http://www.runoob.com/nodejs/nodejs-buffer.html