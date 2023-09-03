export const saveGameToStorage = ({ board, turn }) => {
  // guardar aqui partida
  window.localStorage.setItem('board-v2', JSON.stringify(board))
  window.localStorage.setItem('turn-v2', turn)
}

export const resetGameStorage = () => {
  window.localStorage.removeItem('board-v2')
  window.localStorage.removeItem('turn-v2')
}
