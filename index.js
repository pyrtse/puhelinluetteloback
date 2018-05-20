const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(1000) )
}

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Martti Tienari",
        number: "040-123456"
    },
    {
        id: 3,
        name: "Arto Järvinen",
        number: "040-123456"
    }, 
    {
        id: 4,
        name: "Lea Kutvonen",
        number: "040-123456"
    }
]

app.use(bodyParser.json())

morgan.token('data', function getData (req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':data :method :url :status :res[content-length] - :response-time ms'))


app.get('/info', (req, res) => {
    res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot </p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.number === undefined) {
        return res.status(400).json({error: 'number missing'})
    }

    if (body.name === undefined) {
        return res.status(400).json({error: 'name missing'})
    }

    const names = persons.map(person => person.name)

    if (names.includes(body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})