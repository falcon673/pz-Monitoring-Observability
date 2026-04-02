const express = require('express');
const client = require('prom-client');
const mqtt = require('mqtt');

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const mqttClient = mqtt.connect('mqtt://mqtt-broker:1883');

app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

setInterval(() => {
    mqttClient.publish('service/webapi/status', JSON.stringify({ status: 'up' }));
}, 5000);

app.listen(8080, () => console.log('API running on 8080'));