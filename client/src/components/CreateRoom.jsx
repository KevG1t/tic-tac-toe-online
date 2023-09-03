import {CopyIncon} from '../Icons'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function CreateRoom ({ socket, handleClick }) {
  const [copied, setCopied] = useState(false);
  const roomCode = useRef(crypto.randomUUID())
  const navigate = useNavigate()

  const copyId = () => {
    navigator.clipboard.writeText(roomCode.current)
    setCopied(true);
  }
  //conectar
  useEffect(() => {
    socket.connect()
    socket.emit('create-game', roomCode.current)
    socket.on('game-start', () => {
      navigate(`/game/${roomCode.current}`, {replace: true})
    })
    // TODO: return
  },[])

  return (
    <>
      <div className='text'>
        <h2 className='create-header'>Codigo de sala</h2>
        <span style={{color:'green'}} >{roomCode.current}</span>
        <CopyIncon click={copyId} isCopied={copied} />
        {copied &&  <h6>Copiado!</h6>}
        {copied &&  <span>esperando oponente...</span>}
        
        <button onClick={handleClick}>Cancelar</button>
      </div>
    </>
  )
}