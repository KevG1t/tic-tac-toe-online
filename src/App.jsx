import { Route, Routes } from 'react-router-dom'
import Game from './components/Game'
import { MenuModal } from './components/MenuModal'
import { MENU_ACTIONS } from './constants'
import { useSocketStore } from './store/socket'
import { Menu } from './components/Menu'

import './App.css'

function App () {
  const socket = useSocketStore((state) => state.socket)
  if (socket.connected) socket.disconnect()

  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game/:roomCode" element={<Game isOnline />} />
        <Route
          path="/create-room"
          element={<MenuModal action={MENU_ACTIONS.crate} />}
        />
        <Route
          path="/join-room"
          element={<MenuModal action={MENU_ACTIONS.join} />}
        />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  )
}

export default App
