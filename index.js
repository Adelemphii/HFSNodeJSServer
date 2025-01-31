const express = require('express')
const logger = require('morgan')
const app = express()

logger.token('body', request => {
  return JSON.stringify(request.body)
})

app.use(express.json())
app.use(logger(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people! 
    <br/> 
    <p>${date}`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(person) {
    response.json(person)
  } else {
    response.statusMessage = `Person of id ${id} does not exist!`
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(!validateCreation(body, response)) {
    return
  }

  const person = {
    id: String(Math.floor(Math.random() * 10000)),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const validateCreation = (body, response) => {

  if(!body.name || body.name === '') {
    response.status(400).json({
      error: 'Name is not valid'
    })
    return false
  }

  if(persons.some(person => person.name === body.name)) {
    response.status(400).json({
      error: 'Name must be unique'
    })
    return false
  }

  if(!body.number || body.number === '') {
    response.status(400).json({
      error: 'Number is not valid'
    })
    return false
  }
  return true
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})