import { BaseRequestBody } from './base-request-body';

export class SingleWriteWordsRequestBody extends BaseRequestBody {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    static decode(buffer) {
        try {
            const commandCode = buffer[0]
            if (commandCode !== 0x40) {
                return null
            }

            const wordNumber = (buffer[1] & 0xf0) >> 4
            const channel = (buffer[1] & 0x0f) >> 1
            const data = buffer.slice(4)

            return new this(wordNumber, channel, data)
        } catch (e) {

            return null
        }
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _wordNumber
    _channel
    _data

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor(wordNumber, channel, data) {
        super(0x40)
        this._wordNumber = wordNumber;
        // Toggle bit 目前不考慮
        this._channel = channel;
        // Word address 目前不考慮
        this._data = Buffer.from(data);
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    encode() {

        const payload = Buffer.alloc(4 + this._data.length);

        payload[0] = this._commandCode;
        payload[1] = (this._wordNumber << 4) | (this._channel << 1);
        this._data.copy(payload, 4)

        return payload;
    }
}