import { Link } from 'react-router-dom'

export function Menu () {
    return (
        <section className='board menu'>
            <i id='x'>❌</i>
            <i id='o'>⚪</i>
            <h1> Tic Tac Toe</h1>
        <ul className='menu'>
            <li className='option'>
                <Link className='link' to='/game'>Jugar</Link>
            </li>
            <li className='option'>
                <Link className='link' to='/create-room'>Crear sala</Link>
            </li>
            <li className='option'>
                <Link  className='link' to='/join-room'>Unirse a sala</Link>
            </li>
      </ul>
        </section>
      
    )
  }