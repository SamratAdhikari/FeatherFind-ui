import axios from "axios";

export const SERVER_IP = "http://172.16.103.162:8000";

const server = axios.create({
    baseURL: SERVER_IP,
});

export default server;
