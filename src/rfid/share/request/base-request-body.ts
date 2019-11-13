// 參考
// https://github.com/Cloud-Automation/node-modbus/tree/master/src/request

export class BaseRequestBody {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    _commandCode
    get commandCode() {
        return this._commandCode;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    constructor(commandCode) {
        if (new.target === BaseRequestBody) {
            throw new TypeError('Cannot construct BaseRequest directly.')
        }

        this._commandCode = commandCode;
    }

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    encode() {
        throw new Error('No implemented yet.');
    }
}