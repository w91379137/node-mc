import { ResponseBody } from "./response-body";

export class BaseResponseBody {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _commandCode
    get commandCode() {
        return this._commandCode;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor(commandCode) {
        if (new.target === BaseResponseBody) {
            throw new TypeError('Cannot construct BaseResponseBody directly.')
        }

        this._commandCode = commandCode;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    encode() {
        throw new Error('No implemented yet.');
    }
}