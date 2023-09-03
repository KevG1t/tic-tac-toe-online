import { io } from 'socket.io-client'
import { create } from 'zustand'

export const useSocketStore = create((set, get) => {
    return {
        socket: io('/', {
            autoConnect: false
        })
    }
})