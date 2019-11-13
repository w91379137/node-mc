import { SingleReadWordsResponseBody } from "./single-read-words-response-body";
import { SingleWriteWordsResponseBody } from "./single-write-words-response-body";
import { EnhancedBufferedReadWordsResponseBody } from "./enhanced-buffered-read-words-response-body";
import { QuitResponseBody } from "./quit-response-body";

export class ResponseBody {

    // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

    static decode(buffer) {
        
        // 需要分配下去
        const commandCode = buffer[0]
        var ResponseBody
        
        switch (commandCode) {

            case 0x10:
                ResponseBody = SingleReadWordsResponseBody
                break;

            case 0x40:
                ResponseBody = SingleWriteWordsResponseBody
                break;

            case 0x19:
                ResponseBody = EnhancedBufferedReadWordsResponseBody
                break;

            case 0x02:
                ResponseBody = QuitResponseBody
                break;

            default:
                break;
        }

        if (ResponseBody) {
            return ResponseBody.decode(buffer)
        }

        return null
    }
}