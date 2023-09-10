import { checkAndSetWinner } from './checks.js'
import { saveGameToStorage } from './storage/saveGame.js'
import { TURNS } from '../constants.js'

export const logic = ({ index, TURN, emit = false, isOnline = false, board, roomCode, socket }) => {
  const newBoard = [...board]
  // const newBoard = [...boardRef.current]
  newBoard[index] = TURN
  const newTurn = TURN === TURNS.X ? TURNS.O : TURNS.X

  if (!isOnline) {
    // guardar aqui partida si es local
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })
  }

  const newWinner = checkAndSetWinner(newBoard)
  let newCanPlay = true

  if (isOnline && emit) {
    socket.emit('play', { index, roomCode })
    newCanPlay = false
  }

  return { newBoard, newTurn, newWinner, newCanPlay }
}
