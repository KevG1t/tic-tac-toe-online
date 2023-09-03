import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server)
app.use(cors());

// Almacena las partidas activas con sus claves
const activeGames = new Map()

io.on('connect', (socket) => {
  console.log('User Connected')
  clearRooms(socket)
  socket.on('create-game', (roomCode) => {
    if (!activeGames.has(roomCode)) {
      // Crea una nueva partida y permite que el jugador que la creó se una automáticamente
      const game = { players: [socket.id], roomCode, inGame: false }
      activeGames.set(roomCode, game)
      socket.join(roomCode)
      socket.emit('game-created', roomCode)
      console.log(`Game ${roomCode} created by ${socket.id}`)
    } else {
      // La partida ya existe con esa clave
      socket.emit('game-exists', { message: 'La partida ya existe con ese codigo' })
    }
  })

  socket.on('join-room', (roomCode) => {
    console.log(`a user tries to join the Game ${roomCode}`)

    // Verifica si la partida existe y no está llena
    const game = activeGames.get(roomCode)
    if (game && game.players.length < 2) {
      socket.join(roomCode)
      game.players.push(socket.id)
      console.log(`User has joined the game ${roomCode}`)

      // Notifica al usuario que se unió con éxito
      socket.emit('joined-successfully', roomCode)

      // Si la partida ahora está llena, puedes realizar alguna acción o notificar a ambos jugadores
      if (game.players.length === 2) {
        game.inGame = true
        io.to(roomCode).emit('game-start', roomCode)
        console.log(`Game ${roomCode} had started`)
      }
    } else {
      console.log(`Game ${roomCode} does not exist or has alredady started`)
      // La partida no existe o está llena
      socket.emit('join-failed', { message: 'La partida no existe o ya ha terminado' })
    }
  })

  socket.on('play', ({ index, roomCode }) => {
    console.log(`play at ${index} to ${roomCode}`)
    socket.broadcast.to(roomCode).emit('updateGame', index)
  })

  socket.on('disconnect', () => {
    clearRooms(socket)
    console.log('User disconnect')
  })
})

function clearRooms (socket) {
  // Elimina al jugador de cualquier partida en la que esté
  activeGames.forEach((game, roomCode) => {
    const index = game.players.indexOf(socket.id)
    if (index !== -1) {
      game.players.splice(index, 1)
      console.log('User removed from room')
      socket.broadcast.to(roomCode).emit('player-left', socket.id)

      // Si la partida está vacía, elimínala
      if (game.players.length === 0) {
        activeGames.delete(roomCode)
        console.log(`game ${roomCode} eliminated`)
      }
      // si se desconecto en partida
      if (game.inGame) {
        const winner = game.players[0]
        console.log(`${winner} has won by disconnection`)
        activeGames.delete(roomCode)
        console.log(`game ${roomCode} eliminated by disconnection`)
        socket.broadcast.to(roomCode).emit('winner-by-disconnect', socket.id)
      }
    }
  })
}

const PORT = process.env.PORT ?? 3000

server.listen(PORT, () => {
  console.log(`listen in ${PORT}`)
})
