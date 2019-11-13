import { BaseRequestBody } from './base-request-body';

export class QuitRequestBody extends BaseRequestBody {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    static decode(buffer) {
        try {
            const commandCode = buffer[0]
            if (commandCode !== 0x02) {
                return null
            }

            const channel = (buffer[1] & 0x0f) >> 1

            return new this(channel)
        } catch (e) {

            return null
        }
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _channel

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor(channel) {
        super(0x02)

        // Toggle bit 目前不考慮
        this._channel = channel;

    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    encode() {

        const payload = Buffer.alloc(2);

        payload[0] = this._commandCode;
        payload[1] = this._channel << 1;

        return payload;
    }
}