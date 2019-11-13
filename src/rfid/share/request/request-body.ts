import { SingleReadWordsRequestBody } from './single-read-words-request-body';
import { SingleWriteWordsRequestBody } from './single-write-words-request-body';
import { EnhancedBufferedReadWordsRequestBody } from './enhanced-buffered-read-words-request-body';
import { QuitRequestBody } from './quit-request-body';
// 參考
// https://github.com/Cloud-Automation/node-modbus/tree/master/src/request

export class RequestBody {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    static decode(buffer) {
        // 需要分配下去
        const commandCode = buffer[0]
        var RequestBody
        switch (commandCode) {
            
            case 0x10:
                RequestBody = SingleReadWordsRequestBody
                break;

            case 0x40:
                RequestBody = SingleWriteWordsRequestBody
                break;

            case 0x19:
                RequestBody = EnhancedBufferedReadWordsRequestBody
                break;

            case 0x02:
                RequestBody = QuitRequestBody
                break;

            default:
                break;
        }

        if (RequestBody) {
            return RequestBody.decode(buffer)
        }

        return null
    }
}