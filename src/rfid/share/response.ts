import { ResponseBody } from './response/response-body'

export class Response {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    static decode(buffer) {
        let bodyBuffer = buffer.slice(2);
        let status = bodyBuffer[2]
        if (status === 0xff) {
            // 處理中 不會 管
            return
        }
        
        // 如果不是 00 也要 準備看怎樣處理
        if (status !== 0) {
            // 還有包括 執行中 也是需要模擬
            console.log('status:', status);
        }
        
        let body = ResponseBody.decode(bodyBuffer);
        return new Response(body);
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _body

    get uuid() {
        const body = this._body.encode();
        return `${body[0]}${(body[1] & 0x0f) >> 1}`;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    /** 
     * @param {ResponseBody} body
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