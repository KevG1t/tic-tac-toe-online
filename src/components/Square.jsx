export function Square ({ children, isSelected, updateBoard, index, roomCode }) {
  const className = `square ${isSelected ? 'is-selected' : ''}`
  const handleClick = () => {
    updateBoard(index, roomCode)
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}
