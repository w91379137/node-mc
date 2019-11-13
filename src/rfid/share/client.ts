import { Request } from './request'

import { SingleReadWordsRequestBody } from './request/single-read-words-request-body';
import { SingleWriteWordsRequestBody } from './request/single-write-words-request-body';
import { EnhancedBufferedReadWordsRequestBody } from './request/enhanced-buffered-read-words-request-body';
import { QuitRequestBody } from './request/quit-request-body';

import { Response } from './response'

import { RequestResponseMatchPool } from './request-response-match-pool';

export class Client {

    _socket;
    _matchPool = new RequestResponseMatchPool();
    isWebsocket = false

    constructor(socket) {

        this._socket = socket

        if (!socket) {
            throw new Error('NoSocketException.')
        }

        this._socket.on('data', this._onData.bind(this))
        this._socket.on('message', this._onData.bind(this))
        this._matchPool.continueReadCallback = this.continueRead.bind(this);
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _onData(data) {
        
        let rsp = Response.decode(data)
        if (!rsp) {
            let status = data[4]
            if (status !== 0xff) {
                console.log('unknown Response', data);
            }
            return
        }

        this._matchPool.handle(rsp);
    }

    write(data) {

        if (this.isWebsocket) {
            this._socket.send(data)
        } else {
            this._socket.write(data)
        }
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    singleReadWords(wordNumber, channel) {
        let request
        
        try {
            let body = new SingleReadWordsRequestBody(wordNumber, channel)
            request = new Request(body)
        } catch (e) {
            return Promise.reject(e)
        }
        
        let p = this._matchPool.register(request);
        this.write(request.encode())
        return p;
    }

    singleWriteWords(wordNumber, channel, data) {
        let request

        try {
            let body = new SingleWriteWordsRequestBody(wordNumber, channel, data)
            request = new Request(body)
        } catch (e) {
            return Promise.reject(e)
        }

        let p = this._matchPool.register(request);
        this.write(request.encode())
        return p;
    }

    enhancedBufferedReadWords(wordNumber, channel) {
        let request

        try {
            let body = new EnhancedBufferedReadWordsRequestBody(wordNumber, channel)
            request = new Request(body)
        } catch (e) {
            return Promise.reject(e)
        }

        let p = this._matchPool.register(request);
        this.write(request.encode())
        return p;
    }

    quit(channel) {
        let request

        try {
            let body = new QuitRequestBody(channel)
            request = new Request(body)
        } catch (e) {
            return Promise.reject(e)
        }

        let p = this._matchPool.register(request);
        this.write(request.encode())
        return p;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    continueRead(rsp) {
        console.log(rsp);
    }
}