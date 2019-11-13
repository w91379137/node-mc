
import * as mqtt from 'mqtt';

const opt = {
    port: 1883,
    clientId: 'nodejs'
}

const client = mqtt.connect('mqtt://127.0.0.1', opt)
client.on('connect', function (packet) {
    console.log('mqtt connect');
})

export default client;