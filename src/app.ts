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
    console.log(
        `
        Recive >>
        Method : ${req.method} 
        Path:${req.path} 
        Body:${JSON.stringify(req.body)} 
        Query string:${JSON.stringify(req.query)}
        Info: ${JSON.stringify({...req.query, ...req.body})}

        `);
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

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// api route 建立

import plcRoute from './route/plcRoute';
app.use('/plc', plcRoute);

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

// start the Express server
const port = 5001;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

// 預計放打包好的 前端 網頁
app.use(express.static('public'));

//====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====