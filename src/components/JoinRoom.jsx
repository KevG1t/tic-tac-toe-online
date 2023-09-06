import { useEffect, useState } from 'react'
import { useInput } from '../hooks/useInput'
import { useNavigate } from 'react-router-dom'
import { useSocketStore } from '../store/socket'

export function JoinRoom ({ handleCancel }) {
  const socket = useSocketStore(state => state.socket)
  const [roomCode, setRoomCode] = useState(null)
  const [error, setError] = useState(null)
  const { value, updateValue } = useInput()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const newRoomCode = event.target.value
    updateValue(newRoomCode)
    setError(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setRoomCode(value)
  }
  // conectar
  useEffect(() => {
    socket.connect()
    if (roomCode) {
      socket.emit('join-room', roomCode)

      socket.on('game-start', (roomCode) => {
        if (roomCode) {
          navigate(`/game/${roomCode}`, { replace: true })
        }
      })

      socket.on('join-failed', ({ message }) => {
        setError(message)
      })

      socket.on('game-exists', ({ message }) => {
        setError(message)
        window.location.reload()
      })
    }
    return () => socket.off('game-start', 'join-failed', 'game-exists')
    // TODO: return
  }, [roomCode])

  return (
    <div className='text'>
      <form onSubmit={handleSubmit}>
        <h2>Codigo de sala</h2>
        <input autoComplete='off' onChange={handleChange} value={value} type='text' placeholder='Codigo de sala' />
        {error && <span style={{ color: 'red' }} >{error}</span>}
        <button>Ingresar a sala</button>
      </form>
      <button onClick={handleCancel}>Cancelar</button>
    </div>
  )
}
