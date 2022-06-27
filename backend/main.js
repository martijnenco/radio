import mcpadc from 'mcp-spi-adc';
import { Server } from "socket.io";
import http from 'http';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: '*'
  }
});

const currentDeviceParams = {
  volume: 0,
}

io.listen(3001);
io.on('connection', client => {
  console.log('Client connected');
  client.on('disconnect', () => { console.log('Client disconnected'); });
  client.on('message', message => { console.log(message); });
  client.on('error', err => { console.log(err); });
  client.on('close', () => { console.log('Client closed'); });
  client.on('reconnect', () => { console.log('Client reconnected'); });
  client.on('reconnect_attempt', () => { console.log('Client reconnecting'); });
  client.on('reconnecting', () => { console.log('Client reconnecting'); });
  client.on('reconnect_error', () => { console.log('Client reconnect error'); });
  client.on('reconnect_failed', () => { console.log('Client reconnect failed'); });
  client.on('ping', () => { console.log('Client ping'); });
  client.on('pong', () => { console.log('Client pong'); });
  client.on('upgrade', () => { console.log('Client upgrade'); });
  client.on('message', message => { console.log(message); });
  client.on('packet', packet => { console.log(packet); });
  client.on('noop', () => { console.log('Client noop'); });
  client.on('error', err => { console.log(err); });
  client.on('close', () => { console.log('Client closed'); });
  client.on('disconnect', () => { console.log('Client disconnected'); });
  client.on('reconnect', () => { console.log('Client reconnected'); });
  client.on('reconnect_attempt', () => { console.log('Client reconnecting'); });
  client.on('reconnecting', () => { console.log('Client reconnecting'); });
  client.on('reconnect_error', () => { console.log('Client reconnect error'); });
  client.on('reconnect_failed', () => { console.log('Client reconnect failed'); });

  // INITIALIZE CONNECTION AND SEND CURRENT PARAMS
  client.emit('init', currentDeviceParams);
});

// VOLUME
const volumePod = mcpadc.open(0, { speedHz: 1000 }, err => {
  if (err) throw err;
  const volumeSamples = [];
  setInterval(_ => {
    volumePod.read((err, reading) => {
      if (err) throw err;
      const volume = Math.round(reading.value * 20);

      volumeSamples.push(volume);
      if (volumeSamples.length > 5) volumeSamples.shift();
      const averageVolume = Math.round(volumeSamples.reduce((a, b) => a + b, 0) / volumeSamples.length);

      if (currentDeviceParams.volume !== averageVolume) {
        io.sockets.emit('volume-changed', { volume: averageVolume });
        currentDeviceParams.volume = averageVolume;
      }
    });
  }, 100);
});
