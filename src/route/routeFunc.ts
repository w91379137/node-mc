// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

export function checkKeys(obj, keys) {

    let errorMsg = undefined;
    let objKeys = Object.keys(obj);
    keys.forEach(key => {
        if (!errorMsg) {
            if (objKeys.indexOf(key) < 0) {
                errorMsg = key + ' is required'
            }
        }
    });
    return errorMsg
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

import * as moment from 'moment';

export function getTimestamp() {
    return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====