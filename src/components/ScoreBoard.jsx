import axios from 'axios'
import { useEffect, useState } from 'react'

const randomUsers = [
  'Tweetail',
  'Wahooligan',
  'Frostrich',
  'Butterflux',
  'PositiveBoar',
  'RichLeech',
  'MildWolverine',
  'FarmOyster',
  'GreedyBronco',
  'WorthyDwarf',
]

const ScoreBoard = ({ score }) => {
  const [scores, setScores] = useState(null)
  const [username, setUsername] = useState('')
  const fecthData = async () => {
    const res = await axios.get('http://localhost:5000/scores')
    setScores(res.data)
  }

  const randomUser = () => {
    return randomUsers[Math.floor(Math.random() * randomUsers.length)]
  }

  const saveScore = async (e) => {
    e.preventDefault()
    const data = {
      username,
      score,
    }
    try {
      await axios.post('http://localhost:5000/scores', data)
      fecthData()
    } catch (error) {
      console.log(error)
    }
  }

  const updateUsername = (username) => {
    setUsername(username)
    localStorage.setItem('username', username)
  }

  useEffect(() => {
    fecthData()
    localStorage.getItem('username')
      ? setUsername(localStorage.getItem('username'))
      : setUsername(randomUser())
  }, [])

  //SORT SCORES HIGHEST TO LOWEST
  const descendingScors = scores?.sort((a, b) => b.score - a.score)

  return (
    <div className="score-board">
      <h2>Current score: {score}</h2>
      <h2>High Scores:</h2>
      {descendingScors?.map(({ username, score }, index) => (
        <div key={index}>
          <h4>
            {username}: {score}
          </h4>
        </div>
      ))}
      <form>
        <input
          type="text"
          value={username}
          onChange={(e) => updateUsername(e.target.value)}
        />
        <button type="submit" onClick={saveScore}>
          Save Score
        </button>
      </form>
    </div>
  )
}

export default ScoreBoard
