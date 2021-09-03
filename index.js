const name_input = document.getElementById("name_input");
const message_input = document.getElementById("message_input");
const chat_input = document.getElementById("chat_window");

const client_id = "chat_client" + Math.random();

const options = {
  connectTimeout: 4000,
  clientId: client_id,
  username: "testuser1",
  password: "123456",
  keepalive: 60,
  clean: true,
};

const WebSocket_URL = "ws://brandonhsz.xyz:8083/mqtt";
const client = mqtt.connect(WebSocket_URL, options);

client.on("connect", () => {
  console.log("Connected");

  client.subscribe("chat", (err) => {
    if (!err) console.log("SUBSCCRIBE - SUCCESS");
    else console.log("SUBSCRIBRE - ERROR");
  });
});

client.on("reconnect", (error) => console.log("RECONNECTING" + error));
client.on("error", (error) => console.log("Connect Error" + error));

client.on("message", (topic, message_received) => {
  //string to object
  const received = JSON.parse(message_received.toString());
  const { name, message } = received;

  chat_window.innerHTML =
    chat_window.innerHTML +
    `<div ><span id>${name}</span>: <br> &nbsp&nbsp ${message}</div>`;

  chat_window.scrollTop = chat_window.scrollHeight;
});

message_input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    //name?
    if (name_input.value === "") {
      chat_window.innerHTML =
        chat_window.innerHTML +
        '<div class="alert alert-danger text-center">Your Name is Empy!!</div>';
      return;
    }

    const to_send = {
      name: name_input.value,
      message: message_input.value,
    };

    const send_options = {
      qos: 0,
      retain: true,
    };

    client.publish("chat", JSON.stringify(to_send), send_options);
  }
});
