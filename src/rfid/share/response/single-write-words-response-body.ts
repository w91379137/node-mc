import { BaseResponseBody } from './base-response-body';

export class SingleWriteWordsResponseBody extends BaseResponseBody {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    static decode(buffer) {
        try {
            const commandCode = buffer[0]
            if (commandCode !== 0x40) {
                return null
            }

            const wordNumber = (buffer[1] & 0xf0) >> 4
            const channel = (buffer[1] & 0x0f) >> 1
            const replyCounter = buffer[3]

            return new this(wordNumber, channel, replyCounter)
        } catch (e) {

            return null
        }
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _wordNumber
    _channel
    _replyCounter

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor(wordNumber, channel, replyCounter) {
        super(0x40)
        this._wordNumber = wordNumber;
        // Toggle bit 目前不考慮
        this._channel = channel;
        this._replyCounter = replyCounter;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    encode() {
        const payload = Buffer.alloc(4);

        payload[0] = this._commandCode;
        payload[1] = (this._wordNumber << 4) | (this._channel << 1);
        payload[3] = this._replyCounter;

        return payload;
    }
}