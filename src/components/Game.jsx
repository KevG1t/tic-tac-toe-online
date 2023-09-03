import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

import { Square } from './Square.jsx'
import { TURNS } from '../constants.js'
import { checkWinner, checkEndGame } from '../logic/checks.js'
import { WinnerModal } from './WinnerModal.jsx'
import { saveGameToStorage, resetGameStorage } from '../logic/storage/saveGame.js'

import './Game.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useSocketStore } from '../store/socket.js'

function Game ({ isOnline }) {
  const socket = useSocketStore(state => state.socket)
  const [canPlay, setCanPlay] = useState(true)
  const {roomCode: code} = useParams()
  const [roomCode] = useState(code)
  const navigate = useNavigate()

  const [board, setBoard] = useState(
    () => {
      const boardFromStorage = window.localStorage.getItem('board-v2')

      if (boardFromStorage && !isOnline) return JSON.parse(boardFromStorage)

      return Array(9).fill(null)
    }
  )

  const [turn, setTurn] = useState(() => {
    if (isOnline) return TURNS.X
    const turnForStorage = window.localStorage.getItem('turn-v2')
    return turnForStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  // socket rival
  useEffect(() => {
    if (isOnline) {
     
      if (!socket.connected) {
        navigate('/', {replace: true})
      } 
      socket.on('updateGame', (index) => {

        const newBoard = [...board]
        newBoard[index] = TURNS.O
        setBoard(newBoard)

        const newWinner = checkWinner(newBoard)
        if (newWinner) {
          setWinner(newWinner)
          confetti()
        } else if (checkEndGame(newBoard)) {
          setWinner(false)
        }
        setTurn(TURNS.X)
        setCanPlay(true)
      })

      socket.on('winner-by-disconnect', (socketID) => {
        setWinner(TURNS.X)
        confetti()
      })

      return () => socket.off('updateGame')
    }
  })

  function updateBoard (index, roomCode) {
    if (board[index] || winner) return

    // socket
    if (isOnline) {
      const newBoard = [...board]

      if (canPlay && board[index] === null) {
        newBoard[index] = TURNS.X
        setBoard(newBoard)
        socket.emit('play', { index, roomCode })
        setCanPlay(false)
      }
  
      const newWinner = checkWinner(newBoard)
      if (newWinner) {
        setWinner(newWinner)
        confetti()
      } else if (checkEndGame(newBoard)) {
        setWinner(false)
      }
      setTurn(TURNS.O)
    } else {
      const newBoard = [...board]
      newBoard[index] = turn
      setBoard(newBoard)

      const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
      setTurn(newTurn)

      // guardar aqui partida
      saveGameToStorage({
        board: newBoard,
        turn: newTurn
      })

      const newWinner = checkWinner(newBoard)
      if (newWinner) {
        setWinner(newWinner)
        confetti()
      } else if (checkEndGame(newBoard)) {
        setWinner(false)
      }
    }
  }

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

      <WinnerModal isOnline={isOnline} resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default Game
