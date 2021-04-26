import socket from "socket.io-client";
import { serverUrl } from "../services/serverUrl.json";

const socketIo = () => {
  const token = localStorage.getItem("tokenKey");
  return socket(serverUrl, {
    transports: ["websocket"],
    query: { token },
  });
};

export default socketIo;
