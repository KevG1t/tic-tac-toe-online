import { io } from 'socket.io-client'
import { create } from 'zustand'

export const useSocketStore = create((set, get) => {
    return {
        socket: io('https://socket-io-server-production-ca44.up.railway.app', {
            autoConnect: false
        })
    }
})