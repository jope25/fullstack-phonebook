const Person = require('./models/person')
const mongoose = require('mongoose')

if (process.argv.length > 2) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`lisättiin henkilö ${response.name} numero ${response.number} luetteloon`)
      mongoose.connection.close()
    })
} else {
  console.log('puhelinluettelo:')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}
