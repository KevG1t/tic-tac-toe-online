import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MENU_ACTIONS } from '../constants'
import { useSocketStore } from '../store/socket'
import { CreateRoom } from './CreateRoom'
import { JoinRoom } from './JoinRoom'

export function MenuModal ({ action }) {
  const socket = useSocketStore(state => state.socket)
  const [show, setShow] = useState(true)
  const navigate = useNavigate()
  if (!show) return null

  const handleCancel = () => {
    setShow(false)
    socket.disconnect()
    navigate('/', { replace: true })
  }
  return (
    <section className='winner'>
      {
                action === MENU_ACTIONS.crate
                  ? <CreateRoom handleCancel={handleCancel} />
                  : <JoinRoom handleCancel={handleCancel} />
            }
    </section>
  )
}
