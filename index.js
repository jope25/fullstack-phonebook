const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('req-data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :req-data :status :res[content-length] - :response-time ms'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2,
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3,
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4,
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  } else if (body.number === undefined) {
    return res.status(400).json({ error: 'number missing' })
  } else if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Math.floor(1000)) + 1,
  }

  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.get('/info', (req, res) => {
  res.send(`</p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
    <p>${new Date()}</p>`)
})

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})