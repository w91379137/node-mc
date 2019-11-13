import { GlobalUse } from './../global-use';
import mqtt from './publish';
import { checkKeys } from './routeFunc';
const express = require('express');
const router = express.Router();

router.post('/singleReadWords', async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['name']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let name = body.name
    let rfid = GlobalUse[name]
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid name not found"
        });
        return
    }

    let result = await rfid.singleReadWords()
    // console.log(result);

    res.status(200).send({
        success: true,
        result: result,
    })
});

router.post('/singleWriteWords', async (req, res) => {

    let body = req.body
    let message = checkKeys(body, ['name']);
    if (message) {
        res.status(400).send({
            success: false,
            message: message
        });
        return
    }

    let name = body.name
    let rfid = GlobalUse[name]
    if (!rfid) {
        res.status(400).send({
            success: false,
            message: "rfid name not found"
        });
        return
    }

    let result = await rfid.singleWriteWords()
    // console.log(result);

    res.status(200).send({
        success: true,
        result: result,
    })
});

export default router;