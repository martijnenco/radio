import mcpadc from 'mcp-spi-adc';
import { Server } from "socket.io";
import http from 'http';
import nodaryEncoder from 'nodary-encoder';
import { Gpio } from 'onoff';

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

// ENCODER
const myEncoder = nodaryEncoder(17, 18); // Using GPIO17 & GPIO18
myEncoder.on('rotation', (direction, value) => {
  if (direction == 'R') {
    console.log('Encoder rotated right', value);
  } else {
    console.log('Encoder rotated left', value);
  }
});
myEncoder.on('error', err => {
  console.log(err);
})

// Encoder button on GPIO04
const encoderButton = new Gpio(4, 'in', 'falling', { debounceTimeout: 10 });
encoderButton.watch((err, value) => {
  if (err) throw err;
  console.log('encoderButton');
  io.sockets.emit('encoderButton');
});

const ButtenA = new Gpio(24, 'in', 'rising', { debounceTimeout: 10 });
ButtenA.watch((err, value) => {
  if (err) throw err;
  console.log('ButtenA');
  io.sockets.emit('ButtenA');
});

const ButtenB = new Gpio(23, 'in', 'rising', { debounceTimeout: 10 });
ButtenB.watch((err, value) => {
  if (err) throw err;
  console.log('ButtenB');
  io.sockets.emit('ButtenB');
})

const ButtenC = new Gpio(27, 'in', 'rising', { debounceTimeout: 10 });
ButtenC.watch((err, value) => {
  if (err) throw err;
  console.log('ButtenC');
  io.sockets.emit('ButtenC');
})

const ButtenD = new Gpio(22, 'in', 'rising', { debounceTimeout: 10 });
ButtenD.watch((err, value) => {
  if (err) throw err;
  console.log('ButtenD');
  io.sockets.emit('ButtenD');
})

const ButtenE = new Gpio(14, 'in', 'rising', { debounceTimeout: 10 });
ButtenE.watch((err, value) => {
  if (err) throw err;
  console.log('ButtenE');
  io.sockets.emit('ButtenE');
})

const ButtenF = new Gpio(15, 'in', 'rising', { debounceTimeout: 10 });
ButtenF.watch((err, value) => {
  if (err) throw err;
  console.log('ButtenF');
  io.sockets.emit('ButtenF');
})

process.on('SIGINT', _ => {
  new Gpio(17, 'in', 'falling').unexport();
  new Gpio(18, 'in', 'falling').unexport();
  encoderButton.unexport();
  ButtenA.unexport();
  ButtenB.unexport();
  ButtenC.unexport();
  ButtenD.unexport();
  ButtenE.unexport();
  ButtenF.unexport();
  process.exit();
});