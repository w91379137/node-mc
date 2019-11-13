import { BaseResponseBody } from './base-response-body';

export class QuitResponseBody extends BaseResponseBody {

        // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

        static decode(buffer) {
            try {
                const commandCode = buffer[0]
                if (commandCode !== 0x02) {
                    return null
                }
    
                const channel = (buffer[1] & 0x0f) >> 1
                const replyCounter = buffer[3]
    
                return new this(channel, replyCounter)
            } catch (e) {
    
                return null
            }
        }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _channel
    _replyCounter

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor(channel, replyCounter) {
        super(0x02)
        // Toggle bit 目前不考慮
        this._channel = channel;
        this._replyCounter = replyCounter;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    encode() {
        const payload = Buffer.alloc(4);

        payload[0] = this._commandCode;
        payload[1] = this._channel << 1;
        payload[3] = this._replyCounter;

        return payload;
    }
}