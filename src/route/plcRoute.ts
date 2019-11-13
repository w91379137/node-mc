import { GlobalUse } from './../global-use';
import mqtt from './publish';
import { checkKeys } from './routeFunc';
const express = require('express');
const router = express.Router();

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

router.post('/read', async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['group']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let group = body.group;
    let success = true
    let result = await GlobalUse.plcCollector.readGroup(group).catch(() => {
        success = false
    });

    res.status(200).send({
        success: success,
        result: result
    })
});

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

router.post('/write', async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['tagName', 'value']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let tagName = body.tagName;
    let value = body.value;
    let success = true
    let result = await GlobalUse.plcCollector.write(tagName, value).catch(() => {
        success = false
    });

    res.status(200).send({
        success: success,
        result: result
    })
});

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

export default router;