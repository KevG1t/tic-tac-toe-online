import { useNavigate } from 'react-router-dom'
import { Square } from './Square.jsx'
import { useEffect, useState } from 'react'
import { useSocketStore } from '../store/socket.js'

export function WinnerModal ({ winner, resetGame, isOnline, isOffline, roomCode }) {
  const socket = useSocketStore(state => state.socket)
  const navigate = useNavigate()
  const [wantToPlayAgain, setWantToPlayAgain] = useState(false)
  const [rivalWantsPlay, setRivalWantsPlay] = useState(false)

  const classNameX = (wantToPlayAgain) ? 'play-again-X true' : 'play-again-X'
  const classNameO = (rivalWantsPlay) ? 'play-again-O true' : 'play-again-O'

  const winnerText = winner === false ? 'Empate' : 'Ganó:'

  const handlePlayAgain = () => {
    setWantToPlayAgain(true)
    socket.emit('play-again', { playAgain: true, roomCode })
    if (rivalWantsPlay) {
      setWantToPlayAgain(false)
      setRivalWantsPlay(false)
      resetGame()
    }
  }
  // rival
  useEffect(() => {
    socket.on('play-again', (wantsToPlay) => {
      setRivalWantsPlay(wantsToPlay)
      if (wantToPlayAgain && wantsToPlay) {
        // socket.emit('reset-game', roomCode)
        setWantToPlayAgain(false)
        setRivalWantsPlay(false)
        resetGame()
      }
    })

    return () => {
      socket.off('play-again')
    }
  }, [handlePlayAgain])

  // si no hay ganador no renderizamos la board
  if (winner === null) return null

  const goMenu = () => {
    socket.emit('play-again', { playAgain: false, roomCode })
    socket.disconnect()
    navigate('/', { replace: true })
  }

  return (
    <section className='winner'>
      <div className='text'>
        <h2>{winnerText}</h2>

        <header className='win'>
          {winner && <Square>{winner}</Square>}
        </header>

        <footer>

            {
              isOnline
                ? (<>
                     <div className='icons'>
          <i className={classNameX}>❌</i>
          <i className={classNameO}>⚪</i>

          </div>
                {!isOffline
                  ? <button onClick={handlePlayAgain}>
                      Continuar Jugando
                    </button>
                  : <span >Tu rival se ha desconectado</span>
                }
              </>
                  )
                : null
            }

          <button onClick={
            isOnline ? goMenu : resetGame }>
            {
              isOnline ? 'Menu' : 'Empezar de nuevo'
            }
            </button>

        </footer>
      </div>
    </section>
  )
}
