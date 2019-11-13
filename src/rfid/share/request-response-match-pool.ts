export class RequestResponseMatchPool {

    // timeout = 10; 先不做
    req_pool_dict = {}
    continueReadCallback;

    register(request) {
        
        let dict = this.req_pool_dict;
        let key = request.uuid;
        return new Promise((resolve, _) => {
            dict[key] = resolve;
        });
    }

    handle(response) {
        
        let key = response.uuid;
        let resolve = this.req_pool_dict[key];
        if (resolve) {
            resolve(response);
            delete this.req_pool_dict[key];
        } else {
            let commandCode = response._body.commandCode;
            if (commandCode === 0x19) {
                if (this.continueReadCallback) {
                    this.continueReadCallback(response);
                }
            } else {
                console.log('response not match', response);
            }
        }
    }
}

// 參考
// https://github.com/Cloud-Automation/node-modbus/tree/master/src/request
// 等同 request-handler + response-handler