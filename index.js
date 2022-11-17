const express = require('express')
const morgan = require('morgan') 
const cors = require('cors')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'));
app.use(cors())
app.use(express.static('build'))

let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/', (req, res) => {
    res.send("Moi")
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info over  ${persons.length}  people </p>
        <p> ${new Date().toString()} </p>`
    )    
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    if (persons.some(person => person.id === id)) {
        const person = persons.find(person => person.id === id)
        res.json(person)
    } else {
        res.status(404).end()
    }    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
  })

app.post('/api/persons', (req, res) => {
    const body = req.body
    const id = Math.floor(Math.random() * 1000000)

    if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: 'name or number missing' 
        })
      }

    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({ 
            error: 'name must be unique' 
          })
    }

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }
    console.log(person)
    persons = persons.concat(person)
    res.json(person)    

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})