import axios from "axios";

export const SERVER_IP = "https://b57e-139-5-71-198.ngrok-free.app";

const server = axios.create({
    baseURL: SERVER_IP,
});

export default server;
