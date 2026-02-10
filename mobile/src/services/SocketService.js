import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001'; // Change to server IP if testing on real device

let socket;

export const SocketService = {
    connect() {
        socket = io(SOCKET_URL);
        
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return socket;
    },

    disconnect() {
        if (socket) {
            socket.disconnect();
        }
    },

    sendMessage(message) {
        if (socket) {
            socket.emit('send_message', message);
        }
    },

    onMessage(callback) {
        if (socket) {
            socket.on('receive_message', callback);
        }
    }
};
