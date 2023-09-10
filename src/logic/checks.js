import confetti from 'canvas-confetti'
import { WINNER_COMBOS } from '../constants'

export function checkWinner (boardToCheck) {
  for (const combo of WINNER_COMBOS) {
    const [a, b, c] = combo
    if (
      boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
    ) {
      return boardToCheck[a]
    }
  }
  // si no hay ganador
  return null
}

export function checkEndGame (newBoard) {
  // revisamos si hay un empate
  // si no hay más espacios vacíos
  // en el tablero
  return newBoard.every((square) => square !== null)
}

export const checkAndSetWinner = (board) => {
  const newWinner = checkWinner(board)
  if (newWinner) {
    confetti()
    return newWinner
  } else if (checkEndGame(board)) {
    return false
  }
  return null
}
