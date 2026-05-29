import { io } from "socket.io-client";

const socket = io("https://blooddonation-server-cbnq.onrender.com")

export default socket