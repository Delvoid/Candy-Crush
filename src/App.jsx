import { useState, useEffect } from 'react'

import ScoreBoard from './components/ScoreBoard'

import blank from './images/blank.png'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'

const width = 8
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
]

const App = () => {
  const [board, setBoard] = useState([])
  const [squareBeenDragged, setSquareBeenDragged] = useState(null)
  const [squareBeenReplaced, setSquareBeenReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const getRandomColor = () => {
    return candyColors[Math.floor(Math.random() * candyColors.length)]
  }

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = board[i]
      const isBlank = board[i] === blank

      if (
        columnOfThree.every(
          (square) => board[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3)
        columnOfThree.forEach((square) => (board[square] = blank))
        return true
      }
    }
  }
  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = board[i]
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ]
      const isBlank = board[i] === blank

      if (notValid.includes(i)) continue

      if (
        rowOfThree.every((square) => board[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 3)
        rowOfThree.forEach((square) => (board[square] = blank))
        return true
      }
    }
  }
  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = board[i]
      const isBlank = board[i] === blank

      if (
        columnOfFour.every(
          (square) => board[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 4)
        columnOfFour.forEach((square) => (board[square] = blank))
        return true
      }
    }
  }
  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 2, i + 2, i + 3]
      const decidedColor = board[i]

      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ]
      const isBlank = board[i] === blank

      if (notValid.includes(i)) continue

      if (
        rowOfFour.every((square) => board[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 4)

        rowOfFour.forEach((square) => {
          board[square] = blank
        })
        return true
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i < 64 - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && board[i] === blank) {
        let randomColor = getRandomColor()
        board[i] = randomColor
      }
      if (board[i + width] === blank) {
        board[i + width] = board[i]
        board[i] = blank
      }
    }
  }

  const dragStart = (e) => {
    console.log(e.target)
    console.log('start')
    setSquareBeenDragged(e.target)
  }
  const dragDrop = (e) => {
    console.log(e.target)
    console.log('drop')
    setSquareBeenReplaced(e.target)
  }

  const dragEnd = (e) => {
    console.log('end')
    const squareBeingDraggedId = Number(
      squareBeenDragged.getAttribute('data-id')
    )
    const squareBeingReplacedId = Number(
      squareBeenReplaced.getAttribute('data-id')
    )
    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
    ]
    const validMove = validMoves.includes(squareBeingReplacedId)

    if (validMove) {
      board[squareBeingReplacedId] = squareBeenDragged.getAttribute('src')
      board[squareBeingDraggedId] = squareBeenReplaced.getAttribute('src')

      const isAColumnOfFour = checkForColumnOfFour()
      const isARowOfFour = checkForRowOfFour()
      const isAColumnOfThree = checkForColumnOfThree()
      const isARowOfThree = checkForRowOfThree()

      if (
        squareBeingReplacedId &&
        validMove &&
        (isARowOfThree || isARowOfFour || isAColumnOfThree || isAColumnOfFour)
      ) {
        setSquareBeenDragged(null)
        setSquareBeenReplaced(null)
      } else {
        board[squareBeingReplacedId] = squareBeenReplaced.getAttribute('src')
        board[squareBeingDraggedId] = squareBeenDragged.getAttribute('src')
        setBoard([...board])
      }
    }
  }
  const createBoard = () => {
    const board = []
    for (let i = 0; i < width * width; i++) {
      const randomColor = getRandomColor()
      board.push(randomColor)
    }
    setBoard(board)
  }

  useEffect(() => {
    createBoard()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()
      checkForColumnOfThree()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setBoard([...board])
    }, 100)
    return () => clearInterval(timer)
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    board,
  ])
  return (
    <div className="app">
      <div className="game">
        {board.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  )
}

export default App
