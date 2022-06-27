<script>
  import { io } from "socket.io-client";
  const socket = io("http://192.168.50.8:3001", {
    withCredentials: false,
    credentials: "include",
    crossDomain: true,
    headers: {
      "Origin": "http://192.168.50.8:3000",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    }
  });
  socket.on("connect", () => {
    console.log("connected");
  });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
  socket.on("error", () => {
    console.log("error");
  });
  socket.on("reconnect", () => {
    console.log("reconnect");
  });
  socket.on("reconnect_attempt", () => {
    console.log("reconnect_attempt");
  });
  socket.on("reconnecting", () => {
    console.log("reconnecting");
  });
  socket.on("reconnect_error", () => {
    console.log("reconnect_error");
  });
  socket.on("reconnect_failed", () => {
    console.log("reconnect_failed");
  });
  socket.on("ping", () => {
    console.log("ping");
  });
  socket.on("pong", () => {
    console.log("pong");
  });
  socket.on("connect_error", () => {
    console.log("connect_error");
  });
  socket.on("connect_timeout", () => {
    console.log("connect_timeout");
  });
  socket.on("connect_failed", () => {
    console.log("connect_failed");
  });
  socket.on("message", (data) => {
    console.log(data);
  });

  let currentDeviceParams = {
    volume: 0,
  }
  socket.on("init", (data) => {
    currentDeviceParams = data;
  });
  socket.on("volume-changed", (data) => {
    currentDeviceParams.volume = data.volume;
    console.log(data);
  });

</script>

<main>
  <div id="volume-control">
    <label>Volume:</label>
    <input type="range" min="0" max="20" value={currentDeviceParams.volume} step="1" />
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #d4af37;
    background: black;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
  }

  p {
    line-height: 1.35;
  }
</style>
