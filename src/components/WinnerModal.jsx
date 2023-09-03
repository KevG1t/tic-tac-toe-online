import { useNavigate } from 'react-router-dom'
import { Square } from './Square.jsx'

export function WinnerModal ({ winner, resetGame, isOnline }) {
  if (winner === null) return null
  const navigate = useNavigate()
  const winnerText = winner === false ? 'Empate' : 'Ganó:'
  const redirec = () => navigate('/', {replace: true})
  return (
    <section className='winner'>
      <div className='text'>
        <h2>{winnerText}</h2>

        <header className='win'>
          {winner && <Square>{winner}</Square>}
        </header>

        <footer>
          <button onClick={
            isOnline ? redirec : resetGame
            }>
            {
              isOnline ? 'Menu' : 'Empezar de nuevo'
            }
            </button>
        </footer>
      </div>
    </section>
  )
}
