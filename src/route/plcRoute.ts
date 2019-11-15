import { GlobalUse } from './../global-use';
import { checkKeys } from './routeFunc';
const express = require('express');
const router = express.Router();

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

router.post('/read', async (req, res) => {

    let info = {...req.query, ...req.body};
    let message = checkKeys(info, ['group']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let group = info.group;
    let success = true
    let result = await GlobalUse.plcCollector.readGroup(group).catch(() => {
        success = false
    });

    res.status(200).send({
        success: success,
        result: result
    })

    // res.status(200).send({ a: "test" })
});

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

router.post('/write', async (req, res) => {

    let info = {...req.query, ...req.body};
    let message = checkKeys(info, ['tagName', 'value']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let tagName = info.tagName;
    let value = info.value;
    let success = true
    let result = await GlobalUse.plcCollector.write(tagName, value).catch(() => {
        success = false
    });

    res.status(200).send({
        success: success,
        result: result
    })

    // res.status(200).send({ a: "test" })
});

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

export default router;