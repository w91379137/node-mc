

const net = require('net');
import { Client } from './share/client'

export class RfidCollector {

    client

    connect() {
        // const Host = '169.254.10.12';
        // const Port = 10000;
        const Host = '127.0.0.1';
        const Port = 8888;

        // connect
        const socketClient = net.connect(Port, Host, () => {
            this.client = new Client(socketClient)
        })

        socketClient.on('error', (error) => {
            console.log('RfidCollector retry', error)
            this.client = undefined;
            setTimeout(() => {
                this.connect();
            }, 3000);
        });

        // end
        socketClient.on('end', () => {
            console.log('RfidCollector retry')
            this.client = undefined;
            setTimeout(() => {
                this.connect();
            }, 3000);
        });
    }

    async singleReadWords() {
        if (!this.client) { return undefined; }
        return await this.client.singleReadWords(1, 1);
    }

    async singleWriteWords() {
        if (!this.client) { return undefined; }
        return await this.client.singleWriteWords(1, 1, [0x12, 0x34, 0x55, 0x66]);
    }
}