require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Note = require('./models/note')


const app = express()

app.use (express.json())

//**Middleware function */
app.use(morgan('tiny'))
app.use(express.static('dist'))

app.get('/', (request, response) => {
    console.log('connection set')
})
app.get('/api/notes', (request, response) => {
    Note.find({})
    .then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
    // const id = request.params.id
    // notes = notes.filter(note => note.id !== id)

    // response.status(204).end()
})

app.post('/api/notes', (request,response) => {
    const body = request.body
    
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

//** Middleware function */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
