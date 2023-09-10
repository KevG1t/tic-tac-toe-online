import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { useNavigate, useParams } from 'react-router-dom'
import { useSocketStore } from '../store/socket.js'

import { Square } from './Square.jsx'
import { TURNS } from '../constants.js'
import { checkWinner } from '../logic/checks.js'
import { WinnerModal } from './WinnerModal.jsx'
import { resetGameStorage } from '../logic/storage/saveGame.js'
import { logic } from '../logic/game.js'

function Game ({ isOnline = false }) {
  // estados
  const socket = useSocketStore(state => state.socket)
  const [canPlay, setCanPlay] = useState(true)
  const { roomCode } = useParams()
  const [isOffline, setIsOffline] = useState(false)
  const navigate = useNavigate()

  // inicializamos dependiendo el modo de juego
  const [board, setBoard] = useState(
    () => {
      // si es local retornamos del storage
      const boardFromStorage = window.localStorage.getItem('board-v2')
      if (isOnline || (!isOnline && !boardFromStorage)) return Array(9).fill(null)
      if (boardFromStorage) return JSON.parse(boardFromStorage)
    }
  )
  // turnos
  const [turn, setTurn] = useState(() => {
    // online siempre seras X
    if (isOnline) return TURNS.X
    // cambia el turno localmente
    const turnForStorage = window.localStorage.getItem('turn-v2')
    return turnForStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null)
  // un reset game
  const resetGame = () => {
    setWinner(null)
    if (!isOnline) resetGameStorage()
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setCanPlay(true)
  }

  const logicGame = ({ index, emit, turn }) => {
    const { newBoard, newTurn, newWinner, newCanPlay } = logic({ index, TURN: turn, emit, isOnline, board, roomCode, socket })
    setBoard(newBoard)
    setTurn(newTurn)
    setWinner(newWinner)
    setCanPlay(newCanPlay)
  }

  // actualizaciones del jugador principal
  function updateBoard (index) {
    // si la celda esta llena o ya hay un ganador no hacemos nada
    if (board[index] || winner) return
    // checkeamos el modo de juego
    if (isOnline) {
      if (canPlay && board[index] === null) {
        // logic(index, TURNS.X, true)
        logicGame({ index, emit: true, turn: TURNS.X })
      }
    } else {
      logicGame({ index, turn })
    }
  }

  // actualizaciones del rival
  useEffect(() => {
    // chequeamos el modo de juego en online
    if (isOnline) {
      // si perdemos conexion retornamos al menu
      if (!socket.connected) {
        navigate('/', { replace: true })
      }

      // actualizamos el juego con el turno de el rival
      socket.on('updateGame', (index) => {
        // actualizamos Board y checkeamos si hay un ganador
        // logic(index, TURNS.O, false)
        logicGame({ index, emit: false, turn: TURNS.O })
      })
      // si el oponente pierde conexion obtenemos la victoria
      socket.on('winner-by-disconnect', (socketID) => {
        setIsOffline(true)
        if (!checkWinner(board)) {
          setWinner(TURNS.X)
          confetti()
        }
      })
    }
    return () => {
      socket.off('updateGame')
      socket.off('winner-by-disconnect')
    }
  }, [updateBoard])

  return (

    <main className='board'>
      <h1>Tic tac toe</h1>
      {!isOnline && <button onClick={resetGame}>Reset del juego</button>}
      <section className='game'>
        {
            board.map((square, index) => {
              return (
                <Square
                  key={index}
                  index={index}
                  roomCode={roomCode}
                  updateBoard={updateBoard}
                >
                  {square}
                </Square>
              )
            })
          }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

            <WinnerModal isOnline={isOnline} resetGame={resetGame} winner={winner} roomCode={roomCode} isOffline={isOffline}/>

    </main>
  )
}

export default Game
