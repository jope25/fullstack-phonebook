const Person = require('./models/person')
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

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name.length === 0) {
    return response.status(400).send({ error: 'name missing' })
  } else if (body.number.length === 0) {
    return response.status(400).send({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(Person.format)
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const person = {
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(Person.format)
    .then(updatedAndFormattedPerson => {
      response.json(updatedAndFormattedPerson)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.send(`</p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
        <p>${new Date()}</p>`)
    })
})

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})