//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// server 屬性建立

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware 中介軟體
function loggerMiddleware(req: express.Request, res: express.Response, next) {
    console.log(`Method : ${req.method} Path:${req.path} Body:${JSON.stringify(req.body)}`);
    next();
}
app.use(loggerMiddleware);

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 建立很多個 收集器 Collector 跟 route 連接 透過網路控制
import { GlobalUse } from './global-use';

import { PlcCollector } from './plc/plc-collector';
let plc = new PlcCollector();
plc.connect();
GlobalUse.plcCollector = plc;

// import { RfidCollector } from './rfid/rfid-collector';
// let rfid1 = new RfidCollector();
// GlobalUse.rfidCollector1 = rfid1;
// rfid1.connect();

// let rfid2 = new RfidCollector();
// GlobalUse.rfidCollector2 = rfid2;
// rfid2.connect();

// setTimeout(() => {
//     rfid.singleReadWords().then(rsp => {
//         console.log(rsp);
//     });
// }, 3000);

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// api route 建立

import plcRoute from './route/plcRoute';
import rfidRoute from './route/rfidRoute';

app.use('/plc', plcRoute);
app.use('/rfid', rfidRoute);

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

// start the Express server
const port = 5001;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

// 預計放打包好的 前端 網頁
app.use(express.static('public'));

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====