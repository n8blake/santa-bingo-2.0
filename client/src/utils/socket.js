import React from "react";
import socketio from "socket.io-client";
//import { SOCKET_URL } from "config";

export const socket = socketio.connect();
export const SocketContext = React.createContext();
