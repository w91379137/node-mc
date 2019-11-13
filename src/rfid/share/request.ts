import { RequestBody } from './request/request-body'

export class Request {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    static decode(buffer) {
        let bodyBuffer = buffer.slice(2);
        let body = RequestBody.decode(bodyBuffer);
        return new Request(body);
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _body

    get uuid() {
        const body = this._body.encode();
        return `${body[0]}${(body[1] & 0x0f) >> 1}`;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
    /** 
     * @param {RequestBody} body
     */
    constructor(body) {
        this._body = body;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    encode() {

        const body = this._body.encode()
        const payload = Buffer.alloc(2 + body.length)

        payload.writeUInt16BE(payload.length, 0)
        body.copy(payload, 2)

        return payload;
    }
}