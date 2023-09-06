import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

import { Square } from './Square.jsx'
import { TURNS } from '../constants.js'
import { checkWinner, checkEndGame } from '../logic/checks.js'
import { WinnerModal } from './WinnerModal.jsx'
import { saveGameToStorage, resetGameStorage } from '../logic/storage/saveGame.js'

import { useNavigate, useParams } from 'react-router-dom'
import { useSocketStore } from '../store/socket.js'

function Game ({ isOnline = false }) {
  // estados
  const socket = useSocketStore(state => state.socket)
  const [canPlay, setCanPlay] = useState(true)
  const { roomCode: code } = useParams()
  const [roomCode] = useState(code)
  const [isOffline, setIsOffline] = useState(false)
  const navigate = useNavigate()

  // inicializamos dependiendo el modo de juego
  const [board, setBoard] = useState(
    () => {
      const boardFromStorage = window.localStorage.getItem('board-v2')
      // si es local retornamos del storage
      if (boardFromStorage && !isOnline) return JSON.parse(boardFromStorage)
      // si es online reiniciamos la board
      return Array(9).fill(null)
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

  const boardRef = useRef(board)
  useEffect(() => {
    boardRef.current = board
  }, [board])

  const [winner, setWinner] = useState(null)
  // un reset game
  const resetGame = () => {
    if (!isOnline) {
      resetGameStorage()
      setWinner(null)
    }
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    setCanPlay(true)
    // setPlayAgain(false)
    console.log('reseted')
  }

  const checkAndSetWinner = (board) => {
    const newWinner = checkWinner(board)
    if (newWinner) {
      setWinner(newWinner)
      confetti()
    } else if (checkEndGame(board)) {
      setWinner(false)
    }
  }

  const logic = (index, TURN, emit) => {
    // const newBoard = [...board]
    const newBoard = [...boardRef.current]
    newBoard[index] = TURN
    setBoard(newBoard)
    const newTurn = TURN === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    if (!isOnline) {
      // guardar aqui partida si es local
      saveGameToStorage({
        board: newBoard,
        turn: newTurn
      })
    }

    checkAndSetWinner(newBoard)

    if (isOnline && emit) {
      socket.emit('play', { index, roomCode })
      setCanPlay(false)
    } else {
      setCanPlay(true)
    }
  }

  // actualizaciones del jugador principal
  function updateBoard (index) {
    // si la celda esta llena o ya hay un ganador no hacemos nada
    if (board[index] || winner) return
    // checkeamos el modo de juego
    if (isOnline) {
      if (canPlay && board[index] === null) {
        logic(index, TURNS.X, true)
      }
    } else {
      logic(index, turn, false)
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
        console.log(board)
        // actualizamos Board y checkeamos si hay un ganador
        logic(index, TURNS.O, false)
      })
      // si el oponente pierde conexion obtenemos la victoria
      socket.on('winner-by-disconnect', (socketID) => {
        setIsOffline(true)
        setWinner(TURNS.X)
        confetti()
      })
    }
    return () => {
      socket.off('updateGame')
      socket.off('winner-by-disconnect')
    }
  }, [updateBoard])

  // if (isOnline && winner !== null && playAgain) {
  //   resetGame()
  // }

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
