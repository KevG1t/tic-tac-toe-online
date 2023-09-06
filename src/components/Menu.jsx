import { Link } from 'react-router-dom'
import { useSocketStore } from '../store/socket'

export function Menu () {
  const socket = useSocketStore(state => state.socket)
  if (socket.connected) socket.disconnect()

  return (
        <section className='board menu'>
            <h1> Tic Tac Toe</h1>
        <ul className='menu'>
            <i id='x'>❌</i>
            <i id='o'>⚪</i>
            <li className='option'>
                <Link className='link' to='/game'>Jugar</Link>
            </li>
            <li className='option'>
                <Link className='link' to='/create-room'>Crear sala</Link>
            </li>
            <li className='option'>
                <Link className='link' to='/join-room'>Unirse a sala</Link>
            </li>
      </ul>
        </section>
  )
}
