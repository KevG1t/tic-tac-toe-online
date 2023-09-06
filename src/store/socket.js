import { io } from 'socket.io-client'
import { create } from 'zustand'
//
export const useSocketStore = create((set, get) => {
  return {
    socket: io('https://socket-server-rnp0.onrender.com/', {
      autoConnect: false
    })
  }
})
