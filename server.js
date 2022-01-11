const express = require('express')
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const connectDB = require('./db/connect')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

// Score model
const ScoreScheme = new Schema(
  {
    username: { type: String, required: true },
    score: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)
const ScoreModel = mongoose.model('scores', ScoreScheme)

app.get('/scores', async (req, res) => {
  //20 limit
  //sort

  const scores = await ScoreModel.find().sort({ score: -1 }).limit(10)
  if (!scores) return res.json([])
  res.json(scores)
})

app.post('/scores', async (req, res) => {
  const { username, score } = req.body
  if (!username) {
    return res.json({ error: 'Please provide a username' })
  }
  try {
    await ScoreModel.create({ username, score })
    return res.send('user created')
  } catch (error) {
    console.log(error)
    return res.send('Whoops something went wrong.')
  }
})

const start = async () => {
  try {
    //conect to db
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()

//model
//.env

//save score
//username,score
//get scores
